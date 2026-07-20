using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Models;

namespace SmartBusTracking.API.Services
{
    public class BusService
    {
        private readonly ApplicationDbContext _context;
        private readonly AuditLogService _auditLogService;

        public BusService(
        ApplicationDbContext context,
        AuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        // Get All Buses
        public async Task<List<BusDto>> GetAllAsync()
        {
            return await _context.Buses
                .Include(b => b.Trips)
                .Select(b => new BusDto
                {
                    Id = b.Id,
                    BusNumber = b.BusNumber,
                    BusName = b.BusName,
                    RegistrationNumber = b.RegistrationNumber,
                    Capacity = b.Capacity,
                    DriverId = b.DriverId,

                    // Dynamic Status
                    Status = b.Trips!.Any(t => t.Status == "Running")
                                ? "Not Available"
                                : "Available"
                })
                .ToListAsync();
        }

        // Get Bus By Id
        public async Task<BusDto?> GetByIdAsync(int id)
        {
            return await _context.Buses
                .Where(b => b.Id == id)
                .Select(b => new BusDto
                {
                    Id = b.Id,
                    BusNumber = b.BusNumber,
                    BusName = b.BusName,
                    RegistrationNumber = b.RegistrationNumber,
                    Capacity = b.Capacity,
                    Status = b.Status,
                    DriverId = b.DriverId
                })
                .FirstOrDefaultAsync();
        }

        // Add Bus
        public async Task<BusDto> CreateAsync(CreateBusDto dto)
        {
            var bus = new Bus
            {
                BusNumber = dto.BusNumber,
                BusName = dto.BusName,
                RegistrationNumber = dto.RegistrationNumber,
                Capacity = dto.Capacity,
                Status = dto.Status,
                DriverId = dto.DriverId
            };

            _context.Buses.Add(bus);
            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    0,
    "System",
    "Created Bus",
    $"Added bus {bus.BusNumber}"
);

            return new BusDto
            {
                Id = bus.Id,
                BusNumber = bus.BusNumber,
                BusName = bus.BusName,
                RegistrationNumber = bus.RegistrationNumber,
                Capacity = bus.Capacity,
                Status = bus.Status,
                DriverId = bus.DriverId
            };
        }

        // Update Bus
        public async Task<bool> UpdateAsync(int id, UpdateBusDto dto)
        {
            var bus = await _context.Buses.FindAsync(id);

            if (bus == null)
                return false;

            bus.BusNumber = dto.BusNumber;
            bus.BusName = dto.BusName;
            bus.RegistrationNumber = dto.RegistrationNumber;
            bus.Capacity = dto.Capacity;
            bus.Status = dto.Status;
            bus.DriverId = dto.DriverId;

            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    0,
    "System",
    "Updated Bus",
    $"Updated bus {bus.BusNumber}"
);

            return true;
        }

        // Delete Bus
        public async Task<bool> DeleteAsync(int id)
        {
            var bus = await _context.Buses.FindAsync(id);

            if (bus == null)
                return false;

            string busNumber = bus.BusNumber;

            _context.Buses.Remove(bus);
            await _context.SaveChangesAsync();
            await _auditLogService.LogActionAsync(
    0,
    "System",
    "Deleted Bus",
    $"Deleted bus {busNumber}"
);

            return true;
        }
        public async Task<bool> AssignDriverAsync(int busId, int driverId)
        {
            var bus = await _context.Buses.FindAsync(busId);

            if (bus == null)
                return false;

            var driver = await _context.Drivers.FindAsync(driverId);

            if (driver == null)
                return false;

            bus.DriverId = driverId;

            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> AssignRouteAsync(AssignRouteDto dto)
        {
            var bus = await _context.Buses.FindAsync(dto.BusId);

            if (bus == null)
                return false;

            var route = await _context.Routes.FindAsync(dto.RouteId);

            if (route == null)
                return false;

            bus.RouteId = dto.RouteId;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
