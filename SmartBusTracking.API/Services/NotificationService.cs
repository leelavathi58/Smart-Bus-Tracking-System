using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Models;

namespace SmartBusTracking.API.Services
{
    public class NotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddNotificationAsync(
            string title,
            string message,
            string role)
        {
            var notification = new Notification
            {
                Title = title,
                Message = message,
                Role = role,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);

            await _context.SaveChangesAsync();
        }

        public async Task<List<NotificationDto>> GetNotificationsAsync(string role)
        {
            return await _context.Notifications
                .Where(x => x.Role == role)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new NotificationDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Message = x.Message,
                    IsRead = x.IsRead,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();
        }

        public async Task MarkAsReadAsync(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);

            if (notification == null)
                return;

            notification.IsRead = true;

            await _context.SaveChangesAsync();
        }

        public async Task<int> GetUnreadCountAsync(string role)
        {
            return await _context.Notifications
                .CountAsync(x => x.Role == role && !x.IsRead);
        }
    }
}