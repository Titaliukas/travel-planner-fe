using backend.Data;
using backend.Models;
using backend.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InterestController : ControllerBase
    {
        private readonly ILogger<InterestController> _logger;
        private readonly AppDbContext _context;

        public InterestController(ILogger<InterestController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("form/{userId}")]
        public async Task<ActionResult<string>> getFormType(int userId)
        {
            var hasAnyInterest = await _context.UserInterests
                .AnyAsync(ui => ui.UserId == userId);

            if (!hasAnyInterest)
                return Ok("first");
            else
                return Ok("edit");
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<Interest>>> getAllInterests()
        {
            var allInterests = await _context.Interests
                .OrderBy(i => i.Name)
                .ToListAsync();

            return Ok(allInterests);
        }

        [HttpGet("user/{userId}/interests")]
        public async Task<ActionResult<List<UserInterestDto>>> getUserInterests(int userId)
        {
            var userInterests = await _context.UserInterests
                .Include(ui => ui.Interest)
                .Where(ui => ui.UserId == userId)
                .Select(ui => new UserInterestDto
                {
                    InterestId = ui.InterestId,
                    InterestName = ui.Interest.Name,
                    Score = ui.Score
                })
                .ToListAsync();

            return Ok(userInterests);
        }

        [HttpPost("user/{userId}/save")]
        public async Task<IActionResult> saveForm(int userId, [FromBody] List<SaveUserInterestDto> interests)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
                return NotFound("Vartotojas nerastas");

            var oldInterests = await _context.UserInterests
                .Where(ui => ui.UserId == userId)
                .ToListAsync();
            
            _context.UserInterests.RemoveRange(oldInterests);

            var newInterests = interests.Select(i => new UserInterest
            {
                UserId = userId,
                InterestId = i.InterestId,
                Score = i.Score
            }).ToList();

            await _context.UserInterests.AddRangeAsync(newInterests);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Pomėgiai sėkmingai išsaugoti" });
        }
    }
}