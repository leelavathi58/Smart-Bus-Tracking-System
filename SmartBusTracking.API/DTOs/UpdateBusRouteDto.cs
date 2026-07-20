using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.DTOs
{
    public class UpdateBusRouteDto
    {
        [Required]
        public string RouteName { get; set; } = string.Empty;

        [Required]
        public string Source { get; set; } = string.Empty;

        [Required]
        public string Destination { get; set; } = string.Empty;

        public double TotalDistance { get; set; }

        public double AverageSpeed { get; set; }
    }
}
