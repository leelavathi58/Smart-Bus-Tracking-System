namespace SmartBusTracking.API.DTOs
{
    public class BusDto
    {
        public int Id { get; set; }

        public string BusNumber { get; set; } = string.Empty;

        public string BusName { get; set; } = string.Empty;

        public string RegistrationNumber { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public string Status { get; set; } = string.Empty;

        public int? DriverId { get; set; }
    }
}
