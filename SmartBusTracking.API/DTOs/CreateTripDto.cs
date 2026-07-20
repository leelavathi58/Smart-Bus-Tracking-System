using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.DTOs
{
    public class CreateTripDto
    {
        [Required]
        public int BusId { get; set; }

        [Required]
        public int DriverId { get; set; }

        [Required]
        public int RouteId { get; set; }

        [Required]
        public DateTime StartTime { get; set; }
    }
}