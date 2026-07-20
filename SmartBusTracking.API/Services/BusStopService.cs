using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Models;
using SmartBusTracking.API.Services;

namespace SmartBusTracking.API.Services
{
    public class BusStopService
    {
        
        private readonly ApplicationDbContext _context;
        private readonly AuditLogService _auditLogService;

        public BusStopService(
     ApplicationDbContext context,
     AuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        // Get All
        public async Task<List<BusStopDto>> GetAllAsync()
        {
            return await _context.BusStops
                .Select(s => new BusStopDto
                {
                    Id = s.Id,
                    StopName = s.StopName,
                    Latitude = s.Latitude,
                    Longitude = s.Longitude,
                    RouteId = s.RouteId
                })
                .ToListAsync();
        }

        // Get By Id
        public async Task<BusStopDto?> GetByIdAsync(int id)
        {
            return await _context.BusStops
                .Where(s => s.Id == id)
                .Select(s => new BusStopDto
                {
                    Id = s.Id,
                    StopName = s.StopName,
                    Latitude = s.Latitude,
                    Longitude = s.Longitude,
                    RouteId = s.RouteId
                })
                .FirstOrDefaultAsync();
        }

        // Create
        public async Task<BusStopDto> CreateAsync(CreateBusStopDto dto)
        {
            var stop = new BusStop
            {
                StopName = dto.StopName,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                RouteId = dto.RouteId
            };

            _context.BusStops.Add(stop);
            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    0,
    "Admin",
    "Created Bus Stop",
    $"Added bus stop '{stop.StopName}'."
);

            return new BusStopDto
            {
                Id = stop.Id,
                StopName = stop.StopName,
                Latitude = stop.Latitude,
                Longitude = stop.Longitude,
                RouteId = stop.RouteId
            };
        }

        // Update
        public async Task<bool> UpdateAsync(int id, UpdateBusStopDto dto)
        {
            var stop = await _context.BusStops.FindAsync(id);

            if (stop == null)
                return false;

            stop.StopName = dto.StopName;
            stop.Latitude = dto.Latitude;
            stop.Longitude = dto.Longitude;
            stop.RouteId = dto.RouteId;

            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    0,
    "Admin",
    "Updated Bus Stop",
    $"Updated bus stop '{stop.StopName}'."
);

            return true;
        }

        // Delete
        public async Task<bool> DeleteAsync(int id)
        {
            var stop = await _context.BusStops.FindAsync(id);

            if (stop == null)
                return false;

            string stopName = stop.StopName;

            _context.BusStops.Remove(stop);
            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    0,
    "Admin",
    "Deleted Bus Stop",
    $"Deleted bus stop '{stopName}'."
);

            return true;
        }

        public async Task<List<BusStopDto>> GetByRouteAsync(int routeId)
        {
            return await _context.BusStops
                .Where(s => s.RouteId == routeId)
                .OrderBy(s => s.Id)
                .Select(s => new BusStopDto
                {
                    Id = s.Id,
                    StopName = s.StopName,
                    Latitude = s.Latitude,
                    Longitude = s.Longitude,
                    RouteId = s.RouteId
                })
                .ToListAsync();
        }
    }
}