using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.DTOs
{
    public class LoginRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        // NEW
        [Required]
        public string SelectedRole { get; set; } = string.Empty;
    }
}