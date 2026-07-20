using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PassengerController : ControllerBase
    {
        private readonly PassengerService _service;

        public PassengerController(PassengerService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var passenger = await _service.GetByIdAsync(id);

            if (passenger == null)
                return NotFound();

            return Ok(passenger);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreatePassengerDto dto)
        {
            var passenger = await _service.CreateAsync(dto);

            return Ok(passenger);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdatePassengerDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);

            if (!result)
                return NotFound();

            return Ok("Passenger updated successfully.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);

            if (!result)
                return NotFound();

            return Ok("Passenger deleted successfully.");
        }
    }
}