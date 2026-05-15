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
        private readonly ILogger<RatingController> _logger;
        private readonly AppDbContext _context;

        public RatingController(ILogger<RatingController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        // 1. Funkcija kuri gauna rastų vietų ratings pagal kelionės travelers
        [HttpPost("get-ratings")]
        public async Task<ActionResult<Dictionary<int, double>>> getRatings([FromBody] GetRatingsRequest request)
        {
            // Paimame visus reitingus iš Ratings lentelės pagal sightIds ir travelerIds
            var ratings = await _context.Ratings
                .Where(r => request.SightIds.Contains(r.SightId) && 
                           request.TravelerIds.Contains(r.UserId))
                .ToListAsync();

            // Apskaičiuojame kiekvienos vietos average score
            var averages = countAverages(ratings, request.SightIds);

            return Ok(averages);
        }

        // 2. Privati funkcija kuri apskaičiuoja kiekvienos vietos average score
        private Dictionary<int, double> countAverages(List<Rating> ratings, List<int> sightIds)
        {
            var averages = new Dictionary<int, double>();

            foreach (var sightId in sightIds)
            {
                // Gauname šios vietos visus reitingus
                var sightRatings = ratings.Where(r => r.SightId == sightId).ToList();

                // Apskaičiuojame vidurkį
                var average = sightRatings.Any() 
                    ? Math.Round(sightRatings.Average(r => r.Score), 1)
                    : 0;

                averages.Add(sightId, average);
            }

            return averages;
        }

        // 3. Funkcija kuri išsaugoja įvertinimus
        [HttpPost("save-ratings")]
        public async Task<IActionResult> saveRatings([FromBody] SaveRatingRequest request)
        {
            // Validacija
            if (request.Score < 1 || request.Score > 5)
                return BadRequest(new { message = "Įvertinimas turi būti nuo 1 iki 5" });

            // Patikriname ar vartotojas egzistuoja
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
                return BadRequest(new { message = "Vartotojas nerastas" });

            // Patikriname ar vieta egzistuoja
            var sight = await _context.Sights.FindAsync(request.SightId);
            if (sight == null)
                return BadRequest(new { message = "Vieta nerasta" });

            // Išsaugome įvertinimą (jei jau yra - atnaujiname)
            var existingRating = await _context.Ratings
                .FirstOrDefaultAsync(r => r.UserId == request.UserId && r.SightId == request.SightId);

            if (existingRating != null)
            {
                existingRating.Score = request.Score;
                existingRating.Date = DateTime.Now;
                _context.Ratings.Update(existingRating);
            }
            else
            {
                var rating = new Rating
                {
                    UserId = request.UserId,
                    SightId = request.SightId,
                    Score = request.Score,
                    Date = DateTime.Now
                };
                await _context.Ratings.AddAsync(rating);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Įvertinimas sėkmingai išsaugotas" });
        }
    }
}