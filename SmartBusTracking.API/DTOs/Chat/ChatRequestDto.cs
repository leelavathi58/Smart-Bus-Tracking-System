using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.DTOs.Chat
{
    public class ChatRequestDto
    {
        [Required]
        public string Message { get; set; } = string.Empty;
    }
}
