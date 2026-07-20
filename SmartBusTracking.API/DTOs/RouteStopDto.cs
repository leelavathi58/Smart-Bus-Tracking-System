namespace SmartBusTracking.API.DTOs
{
    public class RouteStopDto
    {
        public int Id { get; set; }

        public int RouteId { get; set; }

        public string RouteName { get; set; } = string.Empty;

        public int BusStopId { get; set; }

        public string StopName { get; set; } = string.Empty;

        public int StopOrder { get; set; }
    }
}