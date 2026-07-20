using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BusRouteController : ControllerBase
    {
        private readonly BusRouteService _busRouteService;

        public BusRouteController(BusRouteService busRouteService)
        {
            _busRouteService = busRouteService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _busRouteService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var route = await _busRouteService.GetByIdAsync(id);

            if (route == null)
                return NotFound("Route not found.");

            return Ok(route);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateBusRouteDto dto)
        {
            var route = await _busRouteService.CreateAsync(dto);
            return Ok(route);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateBusRouteDto dto)
        {
            var updated = await _busRouteService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound("Route not found.");

            return Ok("Route updated successfully.");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _busRouteService.DeleteAsync(id);

            if (!deleted)
                return NotFound("Route not found.");

            return Ok("Route deleted successfully.");
        }
    }
}