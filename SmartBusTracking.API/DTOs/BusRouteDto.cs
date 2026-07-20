namespace SmartBusTracking.API.DTOs
{
    public class BusRouteDto
    {
        public int Id { get; set; }

        public string RouteName { get; set; } = string.Empty;

        public string Source { get; set; } = string.Empty;

        public string Destination { get; set; } = string.Empty;

        public double TotalDistance { get; set; }
    }
}
