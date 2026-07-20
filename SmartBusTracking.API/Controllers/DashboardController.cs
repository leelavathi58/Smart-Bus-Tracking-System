using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs.Dashboard;

namespace SmartBusTracking.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("buses-per-route")]
        public async Task<IActionResult> GetBusesPerRoute()
        {
            var data = await _context.Buses
                .Include(b => b.Route)
                .Where(b => b.Route != null)
                .GroupBy(b => b.Route!.RouteName)
                .Select(g => new BusesPerRouteDto
                {
                    RouteName = g.Key,
                    BusCount = g.Count()
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("trip-status")]
        public async Task<IActionResult> GetTripStatus()
        {
            var data = await _context.Trips
                .GroupBy(t => t.Status)
                .Select(g => new TripStatusDto
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            return Ok(data);
        }
    }
}
