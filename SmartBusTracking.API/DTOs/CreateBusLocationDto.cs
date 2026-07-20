using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.DTOs
{
    public class CreateBusLocationDto
    {
        [Required]
        public int BusId { get; set; }

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }
    }
}