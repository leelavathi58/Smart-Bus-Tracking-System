namespace SmartBusTracking.API.DTOs
{
    public class UpdateTripDto
    {
        public DateTime? EndTime { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}