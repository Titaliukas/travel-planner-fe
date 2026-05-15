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
            var owner = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (owner != null)
            {
                trip.Travelers.Add(owner);
                trip.Owner = owner;
            }
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            Console.WriteLine("Wrote into database");
            return Ok(trip);
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

            var (isValid, message) = validate(trip);
            if (!isValid)
                return BadRequest(message);

            trip.Name = dto.Name;

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

        // ========== MANO PRIDĖTOS FUNKCIJOS ==========

        // 1. Gauti visus kelionės keliautojus
        [HttpGet("{tripId}/travelers")]
        public async Task<ActionResult<List<User>>> getTripTravelers(int tripId)
        {
            var trip = await _context.Trips
                .Include(t => t.Travelers)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound("Kelionė nerasta");

            return Ok(trip.Travelers);
        }

        // 2. Gauti visus sistemos vartotojus
        [HttpGet("users/all")]
        public async Task<ActionResult<List<User>>> getAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // 3. Pridėti pasirinktus keliautojus į kelionę
        [HttpPost("{tripId}/travelers")]
        public async Task<IActionResult> addTravelersToTrip(int tripId, [FromBody] List<int> userIds)
        {
            var trip = await _context.Trips
                .Include(t => t.Travelers)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound("Kelionė nerasta");

            var usersToAdd = await _context.Users
                .Where(u => userIds.Contains(u.Id))
                .ToListAsync();

            foreach (var user in usersToAdd)
            {
                if (!trip.Travelers.Any(t => t.Id == user.Id))
                {
                    trip.Travelers.Add(user);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(trip.Travelers);
        }

        // 4. Pašalinti pasirinktus keliautojus iš kelionės
        [HttpDelete("{tripId}/travelers")]
        public async Task<IActionResult> removeTravelersFromTrip(int tripId, [FromBody] List<int> userIds)
        {
            var trip = await _context.Trips
                .Include(t => t.Travelers)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound("Kelionė nerasta");

            var usersToRemove = trip.Travelers
                .Where(t => userIds.Contains(t.Id))
                .ToList();

            foreach (var user in usersToRemove)
            {
                trip.Travelers.Remove(user);
            }

            await _context.SaveChangesAsync();
            return Ok(trip.Travelers);
        }

        [HttpPost("{tripId}/sight/{sightId}")]
        public async Task<IActionResult> AddSight(int tripId, int sightId)
        {
            var trip = await _context.Trips
                .Include(t => t.Routes)
                    .ThenInclude(r => r.RouteSights)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null) return NotFound("Trip not found");

            var sight = await _context.Sights.FirstOrDefaultAsync(s => s.Id == sightId);

            if (sight == null) return NotFound("Sight not found");

            trip.AddSight(sight);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}