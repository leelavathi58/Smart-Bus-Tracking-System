using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.Models
{
    public class Bus
    {
        public int Id { get; set; }

        [Required]
        public string BusNumber { get; set; } = string.Empty;

        [Required]
        public string BusName { get; set; } = string.Empty;

        [Required]
        public string RegistrationNumber { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public string Status { get; set; } = "Available";

        public int? DriverId { get; set; }

        public Driver? Driver { get; set; }

        public int? RouteId { get; set; }

        public BusRoute? Route { get; set; }

        public ICollection<Trip>? Trips { get; set; }

        public ICollection<BusLocation>? Locations { get; set; }
    }
}
