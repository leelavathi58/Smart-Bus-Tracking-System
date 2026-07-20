namespace SmartBusTracking.API.DTOs
{
    public class BusLocationDto
    {
        public int Id { get; set; }

        public int BusId { get; set; }

        public string BusNumber { get; set; } = string.Empty;

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}