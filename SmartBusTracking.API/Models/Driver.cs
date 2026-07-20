using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.Models
{
    public class Driver
    {
        public int Id { get; set; }

        [Required]
        public string DriverName { get; set; } = string.Empty;

        [Required]
        public string LicenseNumber { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        public int Experience { get; set; }

        public bool IsAvailable { get; set; } = true;

        // ==========================
        // Link Driver -> User
        // ==========================

        public int UserId { get; set; }

        public User? User { get; set; }

        // ==========================
        // Navigation Properties
        // ==========================

        public ICollection<Bus>? Buses { get; set; }

        public ICollection<Trip>? Trips { get; set; }
    }
}