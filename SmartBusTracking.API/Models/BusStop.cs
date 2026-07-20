using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.Models
{
    public class BusStop
    {
        public int Id { get; set; }

        [Required]
        public string StopName { get; set; } = string.Empty;

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public ICollection<RouteStop>? RouteStops { get; set; }

        public int? RouteId { get; set; }

        public BusRoute? Route { get; set; }
    }
}
