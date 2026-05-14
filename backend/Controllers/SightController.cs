using backend.Data;
using backend.Models;
using backend.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SightController : ControllerBase
    {
        private readonly ILogger<SightController> _logger;
        private readonly AppDbContext _context;

        public SightController(ILogger<SightController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Sight>>> getSights()
        {
            var sights = await selectSights();
            return Ok(sights);
        }

        private async Task<List<Sight>> selectSights()
        {
            return await _context.Sights.ToListAsync();
        }
    }
}
