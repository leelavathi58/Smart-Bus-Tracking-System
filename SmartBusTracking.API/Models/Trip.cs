using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.Models
{
    public class Trip
    {
        public int Id { get; set; }

        [Required]
        public int BusId { get; set; }
        public Bus? Bus { get; set; }

        [Required]
        public int DriverId { get; set; }
        public Driver? Driver { get; set; }

        [Required]
        public int RouteId { get; set; }
        public BusRoute? Route { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public string Status { get; set; } = "Scheduled";
    }
}