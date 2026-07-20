using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Models;

namespace SmartBusTracking.API.Services
{
    public class BusRouteService
    {
        private readonly ApplicationDbContext _context;

        private readonly AuditLogService _auditLogService;



        public BusRouteService(
    ApplicationDbContext context,
    AuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        // Get All Routes
        public async Task<List<BusRouteDto>> GetAllAsync()
        {
            return await _context.Routes
                .Select(r => new BusRouteDto
                {
                    Id = r.Id,
                    RouteName = r.RouteName,
                    Source = r.Source,
                    Destination = r.Destination,
                    TotalDistance = r.TotalDistance
                })
                .ToListAsync();
        }

        // Get Route By Id
        public async Task<BusRouteDto?> GetByIdAsync(int id)
        {
            return await _context.Routes
                .Where(r => r.Id == id)
                .Select(r => new BusRouteDto
                {
                    Id = r.Id,
                    RouteName = r.RouteName,
                    Source = r.Source,
                    Destination = r.Destination,
                    TotalDistance = r.TotalDistance
                })
                .FirstOrDefaultAsync();
        }

        // Create Route
        public async Task<BusRouteDto> CreateAsync(CreateBusRouteDto dto)
        {
            var route = new BusRoute
            {
                RouteName = dto.RouteName,
                Source = dto.Source,
                Destination = dto.Destination,
                TotalDistance = dto.TotalDistance,

                 AverageSpeed = dto.AverageSpeed
            };

            _context.Routes.Add(route);
            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    1,
    "Admin",
    "Created Route",
    $"Added route {route.RouteName}"
);

            return new BusRouteDto
            {
                Id = route.Id,
                RouteName = route.RouteName,
                Source = route.Source,
                Destination = route.Destination,
                TotalDistance = route.TotalDistance
            };
        }

        // Update Route
        public async Task<bool> UpdateAsync(int id, UpdateBusRouteDto dto)
        {
            var route = await _context.Routes.FindAsync(id);

            if (route == null)
                return false;

            route.RouteName = dto.RouteName;
            route.Source = dto.Source;
            route.Destination = dto.Destination;
            route.TotalDistance = dto.TotalDistance;

            route.AverageSpeed = dto.AverageSpeed;

            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    1,
    "Admin",
    "Updated Route",
    $"Updated route {route.RouteName}"
);

            return true;
        }

        // Delete Route
        public async Task<bool> DeleteAsync(int id)
        {
            var route = await _context.Routes.FindAsync(id);

            if (route == null)
                return false;

            string routeName = route.RouteName;

            _context.Routes.Remove(route);
            await _context.SaveChangesAsync();
            await _auditLogService.LogActionAsync(
    1,
    "Admin",
    "Deleted Route",
    $"Deleted route {routeName}"
);

            return true;
        }
    }
}