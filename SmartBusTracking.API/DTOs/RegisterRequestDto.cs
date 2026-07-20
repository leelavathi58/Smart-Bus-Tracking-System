using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.DTOs
{
    public class RegisterRequestDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        [Required]
        public int RoleId { get; set; }
    }
}
