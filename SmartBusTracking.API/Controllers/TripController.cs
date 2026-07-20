using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Models;
using SmartBusTracking.API.Services;
using System.Security.Claims;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TripController : ControllerBase
    {
        private readonly TripService _tripService;

        public TripController(TripService tripService)
        {
            _tripService = tripService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _tripService.GetAllAsync());
        }

        [Authorize(Roles = "Driver")]
        [HttpGet("my-trips")]
        public async Task<IActionResult> GetMyTrips()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var trips = await _tripService.GetTripsByUserIdAsync(userId);

            return Ok(trips);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var trip = await _tripService.GetByIdAsync(id);

            if (trip == null)
                return NotFound();

            return Ok(trip);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTripDto dto)
        {
            var trip = await _tripService.CreateAsync(dto);

            return Ok(trip);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateTripDto dto)
        {
            var result = await _tripService.UpdateAsync(id, dto);

            if (!result)
                return NotFound();

            return Ok("Trip updated successfully.");
        }
        [HttpPut("start/{id}")]
        public async Task<IActionResult> StartTrip(int id)
        {
            var result = await _tripService.StartTripAsync(id);

            if (!result)
                return NotFound("Trip not found.");

            return Ok("Trip Started.");
        }

        [HttpPut("end/{id}")]
        public async Task<IActionResult> EndTrip(int id)
        {
            var result = await _tripService.EndTripAsync(id);

            if (!result)
                return NotFound("Trip not found.");

            return Ok("Trip Ended.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _tripService.DeleteAsync(id);

            if (!result)
                return NotFound();

            return Ok("Trip deleted successfully.");
        }



}
}