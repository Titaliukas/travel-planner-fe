using backend.Data;
using backend.Models;
using backend.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RatingsController : ControllerBase
    {
        private readonly ILogger<RatingsController> _logger;
        private readonly AppDbContext _context;

        public RatingsController(ILogger<RatingsController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        // 1. Grąžina visus kelionės sight'us
        [HttpGet("trip/{tripId}/sights")]
        public async Task<ActionResult<List<Sight>>> getTripSights(int tripId)
        {
            var tripExists = await _context.Trips.AnyAsync(t => t.Id == tripId);
            if (!tripExists)
                return NotFound("Kelionė nerasta");

            var sights = await _context.Sights
                .Where(s => s.TripId == tripId)
                .ToListAsync();

            return Ok(sights);
        }

        // 2. Grąžina visus kelionės dalyvius
        [HttpGet("trip/{tripId}/members")]
        public async Task<ActionResult<List<User>>> getTripMembers(int tripId)
        {
            var trip = await _context.Trips
                .Include(t => t.Travelers)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound("Kelionė nerasta");

            var members = new List<User> { trip.Owner! };
            members.AddRange(trip.Travelers);
            members = members.DistinctBy(m => m.Id).ToList();

            return Ok(members);
        }

        // 3. Grąžina vertinimo formą (sight'ai su jų vidurkiais)
        [HttpGet("trip/{tripId}/ratings/form")]
        public async Task<ActionResult<TripRatingsResponseDto>> getRatingsForm(int tripId, int userId)
        {
            var trip = await _context.Trips
                .Include(t => t.Travelers)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound("Kelionė nerasta");

            var memberIds = getTripMemberIds(trip);
            
            var sights = await _context.Sights
                .Where(s => s.TripId == tripId)
                .Include(s => s.Ratings)
                    .ThenInclude(r => r.User)
                .ToListAsync();

            // Apskaičiuoti vidurkius
            var sightsWithRatings = calculateAverageRatings(sights, memberIds);
            
            // Pridėti paskutinį vartotojo įvertinimą
            foreach (var sight in sightsWithRatings)
            {
                var lastUserRating = sights
                    .SelectMany(s => s.Ratings)
                    .Where(r => r.UserId == userId && r.SightId == sight.SightId)
                    .OrderByDescending(r => r.Date)
                    .FirstOrDefault();
                
                sight.UserScore = lastUserRating?.Score ?? 0;
            }

            var overallAverage = sightsWithRatings.Any() 
                ? Math.Round(sightsWithRatings.Average(s => s.AverageScore), 1) 
                : 0;

            return Ok(new TripRatingsResponseDto
            {
                Sights = sightsWithRatings,
                OverallAverage = overallAverage
            });
        }

        // 4. Išsaugoti VISUS kelionės vietų įvertinimus vienu metu
        [HttpPost("trip/{tripId}/save")]
        public async Task<ActionResult<TripRatingsResponseDto>> saveRatings(int tripId, int userId, [FromBody] List<SaveRatingDto> ratings)
        {
            var trip = await _context.Trips
                .Include(t => t.Travelers)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound("Kelionė nerasta");

            // Patikrinti ar vartotojas yra kelionės dalyvis
            var memberIds = getTripMemberIds(trip);
            if (!memberIds.Contains(userId))
                return BadRequest("Vartotojas nėra šios kelionės dalyvis");

            // Išsaugoti kiekvieną įvertinimą
            foreach (var ratingDto in ratings)
            {
                // Patikrinti ar sight priklauso kelionei
                var sight = await _context.Sights
                    .FirstOrDefaultAsync(s => s.Id == ratingDto.SightId && s.TripId == tripId);
                
                if (sight == null)
                    continue;

                // Sukurti NAUJĄ įvertinimą
                var newRating = new Rating
                {
                    Score = ratingDto.Score,
                    Date = DateTime.Now,
                    UserId = userId,
                    SightId = ratingDto.SightId
                };
                
                _context.Ratings.Add(newRating);
            }

            await _context.SaveChangesAsync();

            // Po išsaugojimo perskaičiuoti vidurkius
            var sights = await _context.Sights
                .Where(s => s.TripId == tripId)
                .Include(s => s.Ratings)
                    .ThenInclude(r => r.User)
                .ToListAsync();

            var sightsWithRatings = calculateAverageRatings(sights, memberIds);
            
            // Pridėti paskutinį vartotojo įvertinimą
            foreach (var sightItem in sightsWithRatings)
            {
                var lastUserRating = sights
                    .SelectMany(s => s.Ratings)
                    .Where(r => r.UserId == userId && r.SightId == sightItem.SightId)
                    .OrderByDescending(r => r.Date)
                    .FirstOrDefault();
                
                sightItem.UserScore = lastUserRating?.Score ?? 0;
            }

            var overallAverage = sightsWithRatings.Any() 
                ? Math.Round(sightsWithRatings.Average(s => s.AverageScore), 1) 
                : 0;

            return Ok(new TripRatingsResponseDto
            {
                Sights = sightsWithRatings,
                OverallAverage = overallAverage
            });
        }

        // Private funkcijos
        private List<int> getTripMemberIds(Trip trip)
        {
            var memberIds = new List<int> { trip.OwnerId };
            memberIds.AddRange(trip.Travelers.Select(t => t.Id));
            return memberIds.Distinct().ToList();
        }

        private List<TripSightRatingDto> calculateAverageRatings(List<Sight> sights, List<int> memberIds)
        {
            return sights.Select(sight => new TripSightRatingDto
            {
                SightId = sight.Id,
                SightName = sight.Name,
                City = sight.City,
                AverageScore = getAverageScore(sight.Ratings, memberIds),
                RatingCount = getRatingCount(sight.Ratings, memberIds),
                Ratings = getFilteredRatings(sight.Ratings, memberIds)
            }).ToList();
        }

        private double getAverageScore(List<Rating> ratings, List<int> memberIds)
        {
            var filteredRatings = ratings.Where(r => memberIds.Contains(r.UserId));
            return filteredRatings.Any() 
                ? Math.Round(filteredRatings.Average(r => r.Score), 1) 
                : 0;
        }

        private int getRatingCount(List<Rating> ratings, List<int> memberIds)
        {
            return ratings.Count(r => memberIds.Contains(r.UserId));
        }

        private List<RatingDto> getFilteredRatings(List<Rating> ratings, List<int> memberIds)
        {
            return ratings
                .Where(r => memberIds.Contains(r.UserId))
                .OrderByDescending(r => r.Date)
                .Select(r => new RatingDto
                {
                    Id = r.Id,
                    Score = r.Score,
                    Date = r.Date,
                    UserId = r.UserId,
                    Username = r.User.Username
                }).ToList();
        }
    }
}