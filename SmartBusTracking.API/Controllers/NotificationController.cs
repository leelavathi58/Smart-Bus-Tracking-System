using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBusTracking.API.Services;
using System.Security.Claims;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _notificationService;

        public NotificationController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // GET: api/Notification
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(role))
                return Unauthorized();

            var notifications = await _notificationService.GetNotificationsAsync(role);

            return Ok(notifications);
        }
        // GET: api/Notification/unread-count
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(role))
                return Unauthorized();

            var count = await _notificationService.GetUnreadCountAsync(role);

            return Ok(new { count });
        }

        // PUT: api/Notification/read/5
        [HttpPut("read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            await _notificationService.MarkAsReadAsync(id);

            return Ok(new
            {
                message = "Notification marked as read."
            });
        }
    }
}