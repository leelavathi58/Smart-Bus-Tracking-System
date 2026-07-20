using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.DTOs.ETA;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BusLocationController : ControllerBase
    {
        private readonly BusLocationService _service;

        public BusLocationController(BusLocationService service)
        {
            _service = service;
        }

        // GET: api/BusLocation
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllLocationsAsync());
        }

        // GET: api/BusLocation/1
        [HttpGet("{busId}")]
        public async Task<IActionResult> GetByBusId(int busId)
        {
            var result = await _service.GetLocationAsync(busId);

            if (result == null)
                return NotFound("Bus location not found.");

            return Ok(result);
        }

        // POST: api/BusLocation
        // POST: api/BusLocation
        [HttpPost]
        public async Task<IActionResult> UpdateLocation(CreateBusLocationDto dto)
        {
            try
            {
                var result = await _service.UpdateLocationAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("eta/{busId}")]
        public async Task<IActionResult> GetETA(int busId)
        {
            try
            {
                var result = await _service.GetETAAsync(busId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}