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

        [HttpGet("open-trips-page")]
        public IActionResult OpenTripsPage(int userId)
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
            .Where(t => t.OwnerId == userId || t.Travelers.Any(tr => tr.Id == userId))
            .ToListAsync();
        }
    }
}
