using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.DTOs
{
    public class CreatePassengerDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}