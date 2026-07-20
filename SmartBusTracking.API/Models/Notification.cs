using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.Models
{
    public class Notification
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;
        // Admin / Driver / Passenger

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}