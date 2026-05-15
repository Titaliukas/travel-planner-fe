using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RouteController : ControllerBase
    {
        private readonly ILogger<RouteController> _logger;
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly string _googleMapsApiKey;

        public RouteController(ILogger<RouteController> logger, AppDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _logger = logger;
            _context = context;
            _httpClient = httpClientFactory.CreateClient();
            _googleMapsApiKey = configuration["GoogleMaps:ApiKey"] ?? throw new InvalidOperationException("Google Maps API key not configured");
        }

        // POST /route/trip/{tripId}/distribute?maxDayTime=480
        [HttpPost("trip/{tripId}/distribute")]
        public async Task<IActionResult> distributeRoute(int tripId, [FromQuery] int maxDayTime = 480)
        {
            var trip = await getTripWithSights(tripId);
            if (trip == null) return NotFound("Trip not found");

            var sights = await getTripSights(tripId);
            if (sights.Count == 0) return BadRequest("Trip has no sights");

            if (sights.Count == 0)
                return BadRequest("Trip has no sights");

            // Calculate initial centroid count (total sight visit duration / max day time)
            int centroidCount = calculateCentroidCount(sights, maxDayTime);

            // Steps 6-12: Build ETA matrix between all sight pairs
            var etaMatrix = await buildEtaMatrix(sights);
            Console.WriteLine($"ETA matrix built: {etaMatrix.Count} pairs");

            List<List<Sight>> clusters = new();
            bool valid = false;

            // if any cluster exceeds maxDayTime then valid = false
            while (!valid && centroidCount <= sights.Count)
            {
                // Steps 13-15: Get starting sight and initialize centroids
                var centroids = initializeCentroids(sights, centroidCount, etaMatrix);

                // Steps 16-20: Initial assignment
                clusters = AssignSightsToCentroids(sights, centroids, etaMatrix);
                centroids = RecalculateCentroids(clusters, etaMatrix);

                // Steps 21-27: K-means refinement loop
                double eps = double.MaxValue;
                int iteration = 0;
                int maxIterations = 100;

                while (eps > 0.1 && iteration < maxIterations)
                {
                    var prevCentroidIds = centroids.Select(c => c.Id).ToList();

                    clusters = AssignSightsToCentroids(sights, centroids, etaMatrix); // steps 22-25
                    centroids = RecalculateCentroids(clusters, etaMatrix);             // steps 26-27

                    eps = prevCentroidIds
                        .Zip(centroids, (prev, curr) => prev == curr.Id ? 0.0 : 1.0)
                        .Sum();
                    iteration++;
                }

                // Steps 28-30: Check cluster times
                var clusterTimes = CalculateClusterTimes(clusters, etaMatrix);
                valid = clusterTimes.All(t => t <= maxDayTime);

                if (!valid)
                    centroidCount++;
            }

            Console.WriteLine($"Clusters count: {clusters.Count}");
            for (int i = 0; i < clusters.Count; i++)
                Console.WriteLine($"  Cluster {i + 1}: {clusters[i].Count} sights → {string.Join(", ", clusters[i].Select(s => s.Id))}");

            // Steps 31-32: Assign day and visit order to each RouteSight
            var routeSights = trip.Routes.SelectMany(r => r.RouteSights).ToList();

            for (int day = 0; day < clusters.Count; day++)
            {
                var cluster = clusters[day];
                for (int order = 0; order < cluster.Count; order++)
                {
                    var sight = cluster[order];
                    var routeSight = routeSights.FirstOrDefault(rs => rs.SightId == sight.Id);
                    if (routeSight != null)
                    {
                        routeSight.Day = day + 1;
                        routeSight.VisitOrder = order + 1;
                        _context.RouteSights.Update(routeSight);
                    }
                }

            }

            var allRouteSights = await _context.RouteSights
            .Where(rs => rs.Route.TripId == tripId)
            .ToListAsync();
            Console.WriteLine($"RouteSights in DB for trip {tripId}: {allRouteSights.Count}");
            foreach (var rs in allRouteSights)
                Console.WriteLine($"  RS Id={rs.Id}, SightId={rs.SightId}, RouteId={rs.RouteId}");

            await _context.SaveChangesAsync();

            // Step 33: Return trip days list
            var result = clusters.Select((cluster, index) => new
            {
                Day = index + 1,
                Sights = cluster.Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.City,
                    s.Address,
                    s.Duration,
                    Latitude = s.CoordinateY,
                    Longitude = s.CoordinateX,
                    s.PhotoUrl
                })
            });
            Console.WriteLine("Done");
            Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(result));

            return Ok(result);
        }

        private async Task<Trip?> getTripWithSights(int tripId)
        {
            return await _context.Trips
                .Include(t => t.Routes)
                    .ThenInclude(r => r.RouteSights)
                        .ThenInclude(rs => rs.Sight)
                .FirstOrDefaultAsync(t => t.Id == tripId);
        }

        private async Task<List<Sight>> getTripSights(int tripId)
        {
            return await _context.RouteSights
                .Where(rs => rs.Route.TripId == tripId)
                .Include(rs => rs.Sight)
                .Select(rs => rs.Sight)
                .Distinct()
                .ToListAsync();
        }

        private int calculateCentroidCount(List<Sight> sights, int maxDayTime)
        {
            int totalDuration = sights.Sum(s => s.Duration / 60);
            return Math.Max(1, (int)Math.Ceiling((double)totalDuration / maxDayTime));
        }

        // ─── ETA Matrix ───────────────────────────────────────────────────────────

        private async Task<Dictionary<(int, int), double>> buildEtaMatrix(List<Sight> sights)
        {
            var matrix = new Dictionary<(int, int), double>();

            var origins = string.Join("|", sights.Select(s =>
                $"{s.CoordinateY.ToString(System.Globalization.CultureInfo.InvariantCulture)}," +
                $"{s.CoordinateX.ToString(System.Globalization.CultureInfo.InvariantCulture)}"));

            // getEtaMatrix
            var url = $"https://maps.googleapis.com/maps/api/distancematrix/json" +
                      $"?origins={origins}&destinations={origins}&mode=driving&key={_googleMapsApiKey}";

            var rawResponse = await _httpClient.GetStringAsync(url);

            var response = System.Text.Json.JsonSerializer.Deserialize<GoogleDistanceMatrixResponse>(rawResponse);

            for (int i = 0; i < sights.Count; i++)
            {
                for (int j = 0; j < sights.Count; j++)
                {
                    if (i == j) { matrix[(sights[i].Id, sights[j].Id)] = 0; continue; }

                    var element = response?.Rows?[i]?.Elements?[j];
                    double duration = (element?.Status == "OK" ? element.Duration?.Value ?? 0 : 0) / 60.0;
                    // saveDuration
                    matrix[(sights[i].Id, sights[j].Id)] = duration;
                }
            }

            return matrix;
        }

        private List<Sight> initializeCentroids(List<Sight> sights, int k, Dictionary<(int, int), double> etaMatrix)
        {
            var random = new Random(42); // fixed seed for reproducibility
            var centroids = new List<Sight>();

            // setInitialCentroid
            centroids.Add(sights[random.Next(sights.Count)]);

            // Each subsequent centroid: pick sight with probability proportional to distance from nearest centroid
            while (centroids.Count < k)
            {
                var distances = sights.Select(s =>
                {
                    double minEta = centroids
                        .Select(c => etaMatrix.TryGetValue((s.Id, c.Id), out var eta) ? eta : double.MaxValue)
                        .Min();
                    return minEta;
                }).ToList();

                double total = distances.Sum();
                double threshold = random.NextDouble() * total;
                double cumulative = 0;

                for (int i = 0; i < sights.Count; i++)
                {
                    cumulative += distances[i];
                    if (cumulative >= threshold)
                    {
                        centroids.Add(sights[i]);
                        break;
                    }
                }
            }

            Console.WriteLine($"K-means++ centroids: {string.Join(", ", centroids.Select(c => $"{c.Id}({c.Name})"))}");
            return centroids;
        }

        private List<List<Sight>> AssignSightsToCentroids(List<Sight> sights, List<Sight> centroids, Dictionary<(int, int), double> etaMatrix)
        {
            var clusters = Enumerable.Range(0, centroids.Count)
                .Select(_ => new List<Sight>())
                .ToList();

            foreach (var sight in sights)
            {
                int closestIndex = FindClosestCentroid(sight, centroids, etaMatrix); // step 24
                clusters[closestIndex].Add(sight);                                    // step 25
            }
            return clusters;
        }

        private int FindClosestCentroid(Sight sight, List<Sight> centroids, Dictionary<(int, int), double> etaMatrix)
        {
            double minEta = double.MaxValue;
            int minIndex = 0;
            for (int i = 0; i < centroids.Count; i++)
            {
                if (etaMatrix.TryGetValue((sight.Id, centroids[i].Id), out double eta) && eta < minEta)
                {
                    minEta = eta;
                    minIndex = i;
                }
            }
            return minIndex;
        }

        private List<Sight> RecalculateCentroids(List<List<Sight>> clusters, Dictionary<(int, int), double> etaMatrix)
        {
            // step 26-27: new centroid = sight with min total ETA to all others in the cluster
            return clusters.Select(cluster =>
            {
                if (!cluster.Any()) return cluster.First();
                return cluster.MinBy(s =>
                    cluster.Sum(other => etaMatrix.TryGetValue((s.Id, other.Id), out var eta) ? eta : 0))!;
            }).ToList();
        }

        private List<double> CalculateClusterTimes(List<List<Sight>> clusters, Dictionary<(int, int), double> etaMatrix)
        {
            return clusters.Select(cluster =>
            {
                double travelTime = 0;
                for (int i = 0; i < cluster.Count - 1; i++)
                    if (etaMatrix.TryGetValue((cluster[i].Id, cluster[i + 1].Id), out double eta))
                        travelTime += eta;

                double visitTime = cluster.Sum(s => s.Duration / 60.0); // seconds → minutes

                Console.WriteLine($"  Cluster travel: {travelTime:F0}min, visit: {visitTime:F0}min, total: {travelTime + visitTime:F0}min");
                return travelTime + visitTime;
            }).ToList();
        }
    }

    // ─── Google Maps DTOs ─────────────────────────────────────────────────────────

    public class GoogleDistanceMatrixResponse
    {
        [System.Text.Json.Serialization.JsonPropertyName("status")]
        public string? Status { get; set; }

        [System.Text.Json.Serialization.JsonPropertyName("rows")]
        public List<GoogleRow>? Rows { get; set; }
    }

    public class GoogleRow
    {
        [System.Text.Json.Serialization.JsonPropertyName("elements")]
        public List<GoogleElement>? Elements { get; set; }
    }

    public class GoogleElement
    {
        [System.Text.Json.Serialization.JsonPropertyName("status")]
        public string? Status { get; set; }

        [System.Text.Json.Serialization.JsonPropertyName("duration")]
        public GoogleDuration? Duration { get; set; }
    }

    public class GoogleDuration
    {
        [System.Text.Json.Serialization.JsonPropertyName("value")]
        public int Value { get; set; }
    }
}