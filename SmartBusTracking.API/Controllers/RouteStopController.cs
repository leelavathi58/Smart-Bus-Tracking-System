using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RouteStopController : ControllerBase
    {
        private readonly RouteStopService _routeStopService;

        public RouteStopController(RouteStopService routeStopService)
        {
            _routeStopService = routeStopService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _routeStopService.GetAllAsync());
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Assign(AssignRouteStopDto dto)
        {
            var result = await _routeStopService.AssignAsync(dto);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateRouteStopDto dto)
        {
            var updated = await _routeStopService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound("Route stop not found.");

            return Ok("Route stop updated successfully.");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _routeStopService.DeleteAsync(id);

            if (!deleted)
                return NotFound("Route stop not found.");

            return Ok("Route stop deleted successfully.");
        }
    }
}