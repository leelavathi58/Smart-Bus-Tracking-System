using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BusController : ControllerBase
    {
        private readonly BusService _busService;

        public BusController(BusService busService)
        {
            _busService = busService;
        }

        // GET: api/Bus
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var buses = await _busService.GetAllAsync();
            return Ok(buses);
        }

        // GET: api/Bus/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var bus = await _busService.GetByIdAsync(id);

            if (bus == null)
                return NotFound("Bus not found.");

            return Ok(bus);
        }

        // POST: api/Bus
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateBusDto dto)
        {
            var bus = await _busService.CreateAsync(dto);
            return Ok(bus);
        }

        // PUT: api/Bus/1
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateBusDto dto)
        {
            var updated = await _busService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound("Bus not found.");

            return Ok("Bus updated successfully.");
        }

        // DELETE: api/Bus/1
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _busService.DeleteAsync(id);

            if (!deleted)
                return NotFound("Bus not found.");

            return Ok("Bus deleted successfully.");
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("assign-driver")]
        public async Task<IActionResult> AssignDriver(AssignDriverDto dto)
        {
            var success = await _busService.AssignDriverAsync(dto.BusId, dto.DriverId);

            if (!success)
                return NotFound("Bus or Driver not found.");

            return Ok("Driver assigned successfully.");
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("assign-route")]
        public async Task<IActionResult> AssignRoute(AssignRouteDto dto)
        {
            var result = await _busService.AssignRouteAsync(dto);

            if (!result)
                return NotFound("Bus or Route not found.");

            return Ok("Route assigned successfully.");
        }
    }
}