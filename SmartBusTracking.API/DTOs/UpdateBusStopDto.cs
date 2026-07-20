using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.DTOs
{
    public class UpdateBusStopDto
    {
        [Required]
        public string StopName { get; set; } = string.Empty;

        public double Latitude { get; set; }

        public double Longitude { get; set; }


        public int? RouteId { get; set; }
    }
}
