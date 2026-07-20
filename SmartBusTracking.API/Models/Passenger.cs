using System.ComponentModel.DataAnnotations;

namespace SmartBusTracking.API.Models
{
    public class Passenger
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public int UserId { get; set; }      // NEW

        public User? User { get; set; }      // NEW
    }
}