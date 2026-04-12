using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TripController : ControllerBase
    {
        private readonly ILogger<TripController> _logger;
        private readonly AppDbContext _context;

        public TripController(ILogger<TripController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("openTripsPage")]
        public IActionResult show(int userId)
        {
            Console.WriteLine("Redirecting");
            return Redirect($"http://localhost:3000/trips?userId={userId}");
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Trip>>> getTrips(int userId)
        {
            Console.WriteLine($"trips: {userId}");
            var trips = await selectTrips(userId);

            return Ok(trips);
        }

        private async Task<List<Trip>> selectTrips(int userId)
        {
            return await _context.Trips
                .Include(t => t.Travelers)
                .Where(t => t.OwnerId == userId || t.Travelers.Any(tr => tr.Id == userId))
                .ToListAsync();
        }

        [HttpPost("user/{userId}")]
        public async Task<IActionResult> createTrip(int userId, Trip trip)
        {
            Console.WriteLine("Creating a trip");
            var (isValid, message) = validate(trip);
            if (!isValid)
                return BadRequest(message);

            trip.OwnerId = userId;
            trip.DayCount = (trip.End.Value-trip.Start.Value).Days;
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            Console.WriteLine("Wrote into database");
            return show(userId);
        }

        private (bool,string) validate(Trip trip)
        {
            if (string.IsNullOrWhiteSpace(trip.Name))
                return (false, "Pavadinimas yra privalomas.");

            if (trip.Start == null)
                return (false, "Nurodykite kelionės pradžią");

            if (trip.End == null)
                return (false, "Nurodykite kelionės pabaigą");

            if (trip.End.Value.Date < trip.Start.Value.Date)
                return (false, "Kelionės pabaiga negali būti anksčiau nei pradžia.");
            

            return (true,"");
        }
    }
}
