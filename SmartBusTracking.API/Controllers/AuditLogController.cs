using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AuditLogController : ControllerBase
    {
        private readonly AuditLogService _auditLogService;

        public AuditLogController(AuditLogService auditLogService)
        {
            _auditLogService = auditLogService;
        }

        // GET: api/AuditLog
        [HttpGet]
        public async Task<IActionResult> GetLogs()
        {
            var logs = await _auditLogService.GetLogsAsync();

            return Ok(logs);
        }
    }
}