using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BusStopController : ControllerBase
    {
        private readonly BusStopService _busStopService;

        public BusStopController(BusStopService busStopService)
        {
            _busStopService = busStopService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _busStopService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var stop = await _busStopService.GetByIdAsync(id);

            if (stop == null)
                return NotFound("Bus stop not found.");

            return Ok(stop);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateBusStopDto dto)
        {
            var stop = await _busStopService.CreateAsync(dto);
            return Ok(stop);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateBusStopDto dto)
        {
            var updated = await _busStopService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound("Bus stop not found.");

            return Ok("Bus stop updated successfully.");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _busStopService.DeleteAsync(id);

            if (!deleted)
                return NotFound("Bus stop not found.");

            return Ok("Bus stop deleted successfully.");
        }
        [HttpGet("route/{routeId}")]
        public async Task<IActionResult> GetByRoute(int routeId)
        {
            var stops = await _busStopService.GetByRouteAsync(routeId);

            return Ok(stops);
        }
    }
}