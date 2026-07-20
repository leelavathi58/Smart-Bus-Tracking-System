using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.Models
{
    public class RouteStop
    {
        public int Id { get; set; }

        [Required]
        public int RouteId { get; set; }

        public BusRoute? Route { get; set; }

        [Required]
        public int BusStopId { get; set; }

        public BusStop? BusStop { get; set; }

        public int StopOrder { get; set; }
    }
}