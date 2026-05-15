using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace backend.Controllers
{
	public class RouteController : Controller
	{
		private readonly ILogger<SightController> _logger;
		private readonly AppDbContext _context;

		public RouteController(ILogger<SightController> logger, AppDbContext context)
		{
			_logger = logger;
			_context = context;
		}
		public IActionResult Index()
		{
			return View();
		}

		[HttpGet]
		public async Task<ActionResult<(List<RouteSight> SelectedSights, List<Sight> AllSights)>> retrieveRoute(int tripId, int userId)
		{
			List<Models.Route> routes = await retrieveRoute(tripId);
			List<Models.RouteSight> selectedSights = [];
			if (routes != null && routes.Count > 0)
			{
				selectedSights = await selectByRoute(routes);
			}
			List<Sight> favourites = await getFavouritePlaces();

			var favouriteIds = favourites.Select(f => f.Id).ToList();
			var selectedIds = selectedSights.Select(rs => rs.SightId).Distinct().ToList();

			List<UserInterest> interests = await getByUser(userId);
			List<Sight> allSights = await selectSights(null);

			allSights = [.. allSights.Where(s => !favouriteIds.Contains(s.Id) && !selectedIds.Contains(s.Id))];

			if (interests != null && interests.Count > 0)
			{
				allSights = calculateInterestScore(allSights, interests, favourites);
			}
			return (SelectedSights: selectedSights, AllSights: allSights);
		}

		private List<Sight> calculateInterestScore(List<Sight> sights, List<UserInterest> userInterests, List<Sight> favourites)
		{
			Dictionary<Sight, int> scoreCard = new Dictionary<Sight, int>();
			foreach (Sight sight in sights)
			{
				int score = 0;
				foreach (UserInterest interest in userInterests)
				{
					// TODO
					// foreach (TripInterest tripInterest in _context.TripInterests.Where(i=>i.SightId == sight.Id)
					
					score++;
				}
				scoreCard.Add(sight, score);
			}

			sights = scoreCard.OrderByDescending(s => s.Value).Select(s => s.Key).ToList();

			return formatSightsList(sights, favourites);
		}

		private List<Sight> formatSightsList(List<Sight> sights, List<Sight> favourites)
		{
			sights.InsertRange(0, favourites);
			return sights;
		}

		private async Task<List<Sight>> selectSights(List<int> ids)
		{
			if(ids == null)
			{
				return await _context.Sights.ToListAsync();
			}

			return await _context.Sights.Where(s=>ids.Contains(s.Id)).ToListAsync();
		}

		private async Task<List<UserInterest>> getByUser(int userId)
		{
			return await _context.UserInterests.Where(u => u.UserId == userId).ToListAsync();
		}

		private async Task<List<Models.Route>> retrieveRoute(int tripId)
		{
			return await _context.Routes.Where(x => x.TripId == tripId).ToListAsync();
		}

		private async Task<List<RouteSight>> selectByRoute(List<Models.Route> routes)
		{
			List<RouteSight> sights = new List<RouteSight>();
			foreach (var route in routes)
			{
				sights.AddRange(_context.RouteSights.Where(r => r.Id == route.Id));
			}
			return sights;

		}

		private Task<List<Sight>> getFavouritePlaces()
		{
			return null;
		}

		[HttpPatch]
		public async Task<ActionResult> resetRoute(int tripId)
		{
			Trip target = _context.Trips.Include(t => t.Routes).FirstOrDefault(t=> t.Id == tripId);

			await update(target.Routes, null, null, null, true);

			return Ok();
		}

		private async Task update(List<Models.Route> routes, string? start, string? end, int? routeId, bool reset)
		{
			if (start != null && routeId != null)
			{
				routes.FirstOrDefault(r=>r.Id == routeId).StartingLocation = start;
			}

			if (end != null && routeId != null)
			{
				routes.FirstOrDefault(r => r.Id == routeId).EndingLocation = end;
			}

			if(reset)
			{
				_context.Routes.RemoveRange(routes);
			}

			await _context.SaveChangesAsync();
		}

		public async Task<ActionResult> setStart(int tripId, int routeId, [FromBody] string start)
		{
			Trip target = _context.Trips.Include(t => t.Routes).FirstOrDefault(t => t.Id == tripId);

			await update(target.Routes, start, null, routeId, false);

			return Ok();
		}

		public async Task<ActionResult> setEnd(int tripId, int routeId, string end)
		{
			Trip target = _context.Trips.Include(t => t.Routes).FirstOrDefault(t => t.Id == tripId);

			await update(target.Routes, null, end, routeId, false);

			return Ok();
		}

		public async Task<ActionResult> generateRoute(int tripId, [FromBody] List<int> sightIds)
		{
			Trip target = _context.Trips.Include(t => t.Routes).FirstOrDefault(t => t.Id == tripId);

			if (sightIds.Count == 0)
			{
				return BadRequest("no places selected");
			}

			List<Sight> selectedSights = await selectSights(sightIds);
			double[,] distanceMatrix = new double[selectedSights.Count, selectedSights.Count];
			
			for(int i = 0; i< selectedSights.Count; i++)
			{
				for(int j = 0; j < selectedSights.Count; j++)
				{
					if(i==j)
					{
						continue;
					}
					distanceMatrix[i, j] = getDistance(selectedSights[i].CoordinateX, selectedSights[i].CoordinateY, selectedSights[j].CoordinateX, selectedSights[j].CoordinateY);
				}
			}

			return Ok();
		}

		private double getDistance(double coordinateX1, double coordinateY1, double coordinateX2, double coordinateY2)
		{
			const double R = 6371; // Earth's radius in kilometers

			double lat1 = coordinateY1 * Math.PI / 180.0;
			double lon1 = coordinateY2 * Math.PI / 180.0;
			double lat2 = coordinateX1 * Math.PI / 180.0;
			double lon2 = coordinateX2 * Math.PI / 180.0;

			double dLat = lat2 - lat1;
			double dLon = lon2 - lon1;

			double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
					   Math.Cos(lat1) * Math.Cos(lat2) *
					   Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
			double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

			return R * c;
		}
	}
}
