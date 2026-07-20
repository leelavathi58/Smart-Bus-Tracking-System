using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TrackingController : ControllerBase
    {
        private readonly TrackingService _trackingService;

        public TrackingController(TrackingService trackingService)
        {
            _trackingService = trackingService;
        }

        // GET: api/Tracking/route/1
        [HttpGet("route/{routeId}")]
        public async Task<IActionResult> GetBusesByRoute(int routeId)
        {
            var buses = await _trackingService.GetBusesByRouteAsync(routeId);

            if (buses.Count == 0)
                return NotFound("No buses found for this route.");

            return Ok(buses);
        }
    }
}