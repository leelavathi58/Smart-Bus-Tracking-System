namespace SmartBusTracking.API.DTOs
{
    public class TripDto
    {
        public int Id { get; set; }

        public int BusId { get; set; }

        public string BusNumber { get; set; } = string.Empty;

        public string DriverName { get; set; } = string.Empty;

        public string RouteName { get; set; } = string.Empty;

        public DateTime StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}