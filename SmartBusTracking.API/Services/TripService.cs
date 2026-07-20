using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Models;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Services
{
    public class TripService
    {
        private readonly ApplicationDbContext _context;
        private readonly AuditLogService _auditLogService;

        private readonly NotificationService _notificationService;

        public TripService(
         ApplicationDbContext context, AuditLogService auditLogService,
         NotificationService notificationService)
        {
            _context = context;
            _auditLogService = auditLogService;
            _notificationService = notificationService;
        }

        public async Task<List<TripDto>> GetAllAsync()
        {
            return await _context.Trips
                .Include(t => t.Bus)
                .Include(t => t.Driver)
                .Include(t => t.Route)
                .Select(t => new TripDto
                {
                    Id = t.Id,
                    BusId = t.BusId,
                    BusNumber = t.Bus!.BusNumber,
                    DriverName = t.Driver!.DriverName,
                    RouteName = t.Route!.RouteName,
                    StartTime = t.StartTime,
                    EndTime = t.EndTime,
                    Status = t.Status
                })
                .ToListAsync();
        }

        public async Task<TripDto?> GetByIdAsync(int id)
        {
            return await _context.Trips
                .Include(t => t.Bus)
                .Include(t => t.Driver)
                .Include(t => t.Route)
                .Where(t => t.Id == id)
                .Select(t => new TripDto
                {
                    Id = t.Id,
                    BusId = t.BusId,
                    BusNumber = t.Bus!.BusNumber,
                    DriverName = t.Driver!.DriverName,
                    RouteName = t.Route!.RouteName,
                    StartTime = t.StartTime,
                    EndTime = t.EndTime,
                    Status = t.Status
                })
                .FirstOrDefaultAsync();
        }

        public async Task<TripDto> CreateAsync(CreateTripDto dto)
        {
            var trip = new Trip
            {
                BusId = dto.BusId,
                DriverId = dto.DriverId,
                RouteId = dto.RouteId,
                StartTime = dto.StartTime,
                Status = "Scheduled"
            };

            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    0,
    "Admin",
    "Created Trip",
    $"Created trip for Bus ID {trip.BusId}."
);

            await _notificationService.AddNotificationAsync(
    "New Trip Created",
    $"Trip for bus {trip.BusId} has been scheduled.",
    "Admin");

            return (await GetByIdAsync(trip.Id))!;
        }

        public async Task<bool> UpdateAsync(int id, UpdateTripDto dto)
        {
            var trip = await _context.Trips.FindAsync(id);

            if (trip == null)
                return false;

            trip.EndTime = dto.EndTime;
            trip.Status = dto.Status;

            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    0,
    "Admin",
    "Updated Trip",
    $"Updated trip ID {trip.Id}."
);

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var trip = await _context.Trips.FindAsync(id);

            if (trip == null)
                return false;

            int tripId = trip.Id;

            _context.Trips.Remove(trip);

            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    0,
    "Admin",
    "Deleted Trip",
    $"Deleted trip ID {tripId}."
);

            return true;
        }
        public async Task<bool> StartTripAsync(int id)
        {
            var trip = await _context.Trips.FindAsync(id);

            if (trip == null)
                return false;

            trip.Status = "Running";
            trip.StartTime = DateTime.Now;

            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    0,
    "Admin",
    "Started Trip",
    $"Started trip ID {trip.Id}."
);

            await _notificationService.AddNotificationAsync(
    "Trip Started",
    $"Bus {trip.Bus?.BusNumber ?? trip.BusId.ToString()} has started its trip.",
    "Admin");

            await _notificationService.AddNotificationAsync(
                "Trip Started",
                "Your assigned trip has started.",
                "Driver");

            await _notificationService.AddNotificationAsync(
                "Bus Running",
                "A bus has started its route. You can track it from the Track Bus page.",
                "Passenger");

           

            return true;
        }

        public async Task<bool> EndTripAsync(int id)
        {
            var trip = await _context.Trips.FindAsync(id);

            if (trip == null)
                return false;

            trip.Status = "Completed";
            trip.EndTime = DateTime.Now;

            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    0,
    "Admin",
    "Completed Trip",
    $"Completed trip ID {trip.Id}."
);

            await _notificationService.AddNotificationAsync(
    "Trip Completed",
    $"Bus {trip.Bus?.BusNumber ?? trip.BusId.ToString()} has completed its trip.",
    "Admin");

            await _notificationService.AddNotificationAsync(
                "Trip Completed",
                "Your assigned trip has been completed.",
                "Driver");

            return true;
        }
        public async Task<List<TripDto>> GetTripsByUserIdAsync(int userId)
        {
            var driver = await _context.Drivers
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (driver == null)
                return new List<TripDto>();

            return await _context.Trips
                .Include(t => t.Bus)
                .Include(t => t.Driver)
                .Include(t => t.Route)
                .Where(t => t.DriverId == driver.Id)
                .Select(t => new TripDto
                {
                    Id = t.Id,
                    BusId = t.BusId,
                    BusNumber = t.Bus!.BusNumber,
                    DriverName = t.Driver!.DriverName,
                    RouteName = t.Route!.RouteName,
                    StartTime = t.StartTime,
                    EndTime = t.EndTime,
                    Status = t.Status
                })
                .ToListAsync();
        }
    }
}