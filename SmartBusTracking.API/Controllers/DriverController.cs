using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DriverController : ControllerBase
    {
        private readonly DriverService _driverService;

        public DriverController(DriverService driverService)
        {
            _driverService = driverService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _driverService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var driver = await _driverService.GetByIdAsync(id);

            if (driver == null)
                return NotFound("Driver not found.");

            return Ok(driver);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateDriverDto dto)
        {
            var driver = await _driverService.CreateAsync(dto);
            return Ok(driver);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateDriverDto dto)
        {
            var updated = await _driverService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound("Driver not found.");

            return Ok("Driver updated successfully.");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _driverService.DeleteAsync(id);

            if (!deleted)
                return NotFound("Driver not found.");

            return Ok("Driver deleted successfully.");
        }
    }
}