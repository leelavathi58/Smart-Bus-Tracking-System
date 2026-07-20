using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.Models
{
    public class BusRoute
    {
        public int Id { get; set; }

        [Required]
        public string RouteName { get; set; } = string.Empty;

        [Required]
        public string Source { get; set; } = string.Empty;

        [Required]
        public string Destination { get; set; } = string.Empty;

        public double TotalDistance { get; set; }

        public double AverageSpeed { get; set; } = 40;

        public ICollection<Bus>? Buses { get; set; }
        public ICollection<RouteStop>? RouteStops { get; set; }

        public ICollection<Trip>? Trips { get; set; }
    }
}
