using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Models;

namespace SmartBusTracking.API.Services
{
    public class AuditLogService
    {
        private readonly ApplicationDbContext _context;

        public AuditLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task LogActionAsync(
            int userId,
            string userName,
            string action,
            string details)
        {
            var log = new AuditLog
            {
                UserId = userId,
                UserName = userName,
                Action = action,
                Details = details,
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(log);

            await _context.SaveChangesAsync();
        }

        public async Task<List<AuditLogDto>> GetLogsAsync()
        {
            return await _context.AuditLogs
                .OrderByDescending(x => x.Timestamp)
                .Take(100)
                .Select(x => new AuditLogDto
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    Action = x.Action,
                    Details = x.Details,
                    Timestamp = x.Timestamp
                })
                .ToListAsync();
        }
    }
}