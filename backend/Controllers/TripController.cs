using backend.Data;
using backend.Models;
using backend.DTO;
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
        public IActionResult showTripsPage(int userId)
        {
            Console.WriteLine("Redirecting");
            return Redirect($"http://localhost:3000/trips?userId={userId}");
        }

        [HttpGet("openTripPage")]
        public IActionResult showTripPage(int tripId)
        {
            Console.WriteLine("Redirecting");
            return Redirect($"http://localhost:3000/trip?tripId={tripId}");
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

        [HttpGet("{tripId}")]
        public async Task<ActionResult<Trip>> getTrip(int tripId)
        {
            Console.WriteLine("Getting a trip");
            var trip = await selectTrip(tripId);

            if (trip == null)
                return NotFound();

            return Ok(trip);
        }

        private async Task<Trip> selectTrip(int tripId)
        {
            return await _context.Trips
                .Include(t => t.Travelers)
                .FirstOrDefaultAsync(t => t.Id == tripId);
        }

        [HttpPost("user/{userId}")]
        public async Task<IActionResult> createTrip(int userId, Trip trip)
        {
            Console.WriteLine("Creating a trip");
            var (isValid, message) = validate(trip);
            if (!isValid)
                return BadRequest(message);

            trip.OwnerId = userId;
            //trip.DayCount = (trip.End.Value-trip.Start.Value).Days;
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            Console.WriteLine("Wrote into database");
            return showTripsPage(userId);
        }

        private (bool,string) validate(Trip trip)
        {
            if (string.IsNullOrWhiteSpace(trip.Name))
                return (false, "Pavadinimas yra privalomas.");

            //if (trip.Start == null)
            //    return (false, "Nurodykite kelionės pradžią");

            //if (trip.End == null)
            //    return (false, "Nurodykite kelionės pabaigą");

            //if (trip.End.Value.Date < trip.Start.Value.Date)
            //    return (false, "Kelionės pabaiga negali būti anksčiau nei pradžia.");
            

            return (true,"");
        }

        [HttpDelete("{tripId}")]
        public async Task<IActionResult> deleteTrip(int tripId)
        {
            var trip = await _context.Trips
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound();

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{tripId}")]
        public async Task<IActionResult> updateTrip(int tripId, [FromBody] UpdateTripDto dto)
        {
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound();

            trip.Name = dto.Name;

            var (isValid, message) = validate(trip);
            if (!isValid)
                return BadRequest(message);

            await _context.SaveChangesAsync();

            return Ok(trip);
        }

        [HttpPatch("{tripId}/start")]
        public async Task<IActionResult> startTrip(int tripId, [FromBody] StartTripDto dto)
        {
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound();

            if (trip.IsPaused)
            {
                trip.IsPaused = false;
            }
            else if (trip.Start == null)
            {
                trip.Start = dto.Start;
            }

            await _context.SaveChangesAsync();

            return Ok(trip);
        }

        [HttpPatch("{tripId}/end")]
        public async Task<IActionResult> endTrip(int tripId, [FromBody] EndTripDto dto)
        {
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound();

            if (trip.Start != null)
                trip.End = dto.End;

            await _context.SaveChangesAsync();

            return Ok(trip);
        }

        [HttpPatch("{tripId}/pause")]
        public async Task<IActionResult> pauseTrip(int tripId)
        {
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound();

            if (trip.Start != null)
                trip.IsPaused = true;

            await _context.SaveChangesAsync();

            return Ok(trip);
        }

        [HttpPatch("{tripId}/cancel")]
        public async Task<IActionResult> cancelTrip(int tripId)
        {
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound();

            if (!trip.IsCancelled)
            {
                trip.IsCancelled = true;
            }

            await _context.SaveChangesAsync();

            return Ok(trip);
        }

        [HttpPatch("{tripId}/restore")]
        public async Task<IActionResult> restoreTrip(int tripId)
        {
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound();

            if (trip.IsCancelled)
            {
                trip.IsCancelled = false;
            }

            await _context.SaveChangesAsync();

            return Ok(trip);
        }
    }
}
