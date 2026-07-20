namespace SmartBusTracking.API.DTOs.ETA
{
    public class BusEtaDto
    {
        public string BusNumber { get; set; } = string.Empty;

        public string RouteName { get; set; } = string.Empty;

        public double TotalDistanceKm { get; set; }

        public double RemainingDistanceKm { get; set; }

        public double AverageSpeed { get; set; }

        public int EstimatedMinutes { get; set; }
    }
}