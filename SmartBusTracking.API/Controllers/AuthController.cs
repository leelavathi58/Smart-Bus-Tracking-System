using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.DTOs.Auth;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly AuditLogService _auditLogService;

        public AuthController(
       AuthService authService,
       AuditLogService auditLogService)
        {
            _authService = authService;
            _auditLogService = auditLogService;
        }
        [AllowAnonymous]
        [HttpPost("passenger-register")]
        public async Task<IActionResult> PassengerRegister(PassengerRegisterDto dto)
        {
            try
            {
                var result = await _authService.RegisterPassengerAsync(dto);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto dto)
        {
            try
            {
                var result = await _authService.LoginAsync(dto);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var userName = User.FindFirst(ClaimTypes.Name)!.Value;

            await _auditLogService.LogActionAsync(
                userId,
                userName,
                "Logout",
                $"{userName} logged out."
            );

            return Ok(new
            {
                message = "Logged out successfully."
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto dto)
        {
            var result = await _authService.RegisterAsync(dto);

            if (result == "Email already exists.")
                return BadRequest(result);

            return Ok(result);
        }
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var profile = await _authService.GetProfileAsync(userId);

            if (profile == null)
                return NotFound();

            return Ok(profile);
        }
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await _authService.ChangePasswordAsync(userId, dto);

            if (result != "Password changed successfully.")
                return BadRequest(result);

            return Ok(result);
        }
    }
}
