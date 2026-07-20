namespace SmartBusTracking.API.DTOs
{
    public class DriverDto
    {
        public int Id { get; set; }

        public string DriverName { get; set; } = string.Empty;

        public string LicenseNumber { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public int Experience { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}