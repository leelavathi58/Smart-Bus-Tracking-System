using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.DTOs
{
    public class UpdateBusDto
    {
        [Required]
        public string BusNumber { get; set; } = string.Empty;

        [Required]
        public string BusName { get; set; } = string.Empty;

        [Required]
        public string RegistrationNumber { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public string Status { get; set; } = "Available";

        public int? DriverId { get; set; }
    }
}
