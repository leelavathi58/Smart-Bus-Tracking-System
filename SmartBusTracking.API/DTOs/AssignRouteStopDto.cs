namespace SmartBusTracking.API.DTOs
{
    public class AssignRouteStopDto
    {
        public int RouteId { get; set; }

        public int BusStopId { get; set; }

        public int StopOrder { get; set; }
    }
}