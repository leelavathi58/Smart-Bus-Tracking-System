namespace SmartBusTracking.API.DTOs.Dashboard
{
    public class BusesPerRouteDto
    {
        public string RouteName { get; set; } = string.Empty;

        public int BusCount { get; set; }
    }
}