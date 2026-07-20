using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.Models
{
    public class BusLocation
    {
        public int Id { get; set; }

        [Required]
        public int BusId { get; set; }

        public Bus? Bus { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}