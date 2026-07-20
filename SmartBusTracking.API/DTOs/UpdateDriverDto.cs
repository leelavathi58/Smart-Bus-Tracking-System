using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.DTOs
{
    public class UpdateDriverDto
    {
        [Required]
        public string DriverName { get; set; } = string.Empty;

        [Required]
        public string LicenseNumber { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        public int Experience { get; set; }

        public bool IsAvailable { get; set; }
    }
}