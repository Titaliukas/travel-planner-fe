using backend.Data;
using backend.Models;
using backend.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RatingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RatingController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("getRatings")]
        public async Task<ActionResult<Dictionary<int, double>>> getRatings([FromBody] GetRatingsRequestDto request)
        {
            var ratings = await _context.Ratings
                .Where(r => request.SightIds.Contains(r.SightId) && request.TravelerIds.Contains(r.UserId))
                .ToListAsync();

            var averages = new Dictionary<int, double>();
            foreach (var sightId in request.SightIds)
            {
                var sightRatings = ratings.Where(r => r.SightId == sightId).ToList();
                var average = sightRatings.Any() ? Math.Round(sightRatings.Average(r => r.Score), 1) : 0;
                averages.Add(sightId, average);
            }

            return Ok(averages);
        }

        [HttpPost("saveRatings")]
        public async Task<IActionResult> saveRatings([FromBody] SaveRatingRequestDto request)
        {
            if (request.Score < 1 || request.Score > 5)
                return BadRequest(new { message = "Score must be 1-5" });

            var existing = await _context.Ratings
                .FirstOrDefaultAsync(r => r.UserId == request.UserId && r.SightId == request.SightId);

            if (existing != null)
            {
                existing.Score = request.Score;
                existing.Date = DateTime.Now;
            }
            else
            {
                _context.Ratings.Add(new Rating
                {
                    UserId = request.UserId,
                    SightId = request.SightId,
                    Score = request.Score,
                    Date = DateTime.Now
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Rating saved" });
        }
    }
}