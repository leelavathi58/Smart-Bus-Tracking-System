namespace SmartBusTracking.API.DTOs
{
    public class TrackBusDto
    {
        public int BusId { get; set; }

        public string BusNumber { get; set; } = string.Empty;

        public string BusName { get; set; } = string.Empty;

        public string DriverName { get; set; } = string.Empty;

        public string RouteName { get; set; } = string.Empty;

        public string Source { get; set; } = string.Empty;

        public string Destination { get; set; } = string.Empty;

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string TripStatus { get; set; } = string.Empty;
    }
}