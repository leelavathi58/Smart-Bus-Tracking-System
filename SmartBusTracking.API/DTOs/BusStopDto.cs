namespace SmartBusTracking.API.DTOs
{
    public class BusStopDto
    {
        public int Id { get; set; }
        public string StopName { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public int? RouteId { get; set; }
    }
}
