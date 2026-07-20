using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Models;

namespace SmartBusTracking.API.Services
{
    public class RouteStopService
    {
        private readonly ApplicationDbContext _context;

        public RouteStopService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<RouteStopDto>> GetAllAsync()
        {
            return await _context.RouteStops
                .Include(r => r.Route)
                .Include(r => r.BusStop)
                .OrderBy(r => r.StopOrder)
                .Select(r => new RouteStopDto
                {
                    Id = r.Id,
                    RouteId = r.RouteId,
                    RouteName = r.Route!.RouteName,
                    BusStopId = r.BusStopId,
                    StopName = r.BusStop!.StopName,
                    StopOrder = r.StopOrder
                })
                .ToListAsync();
        }

        public async Task<RouteStopDto> AssignAsync(AssignRouteStopDto dto)
        {
            var route = await _context.Routes.FindAsync(dto.RouteId);
            if (route == null)
                throw new Exception($"Route {dto.RouteId} not found.");

            var stop = await _context.BusStops.FindAsync(dto.BusStopId);
            if (stop == null)
                throw new Exception($"BusStop {dto.BusStopId} not found.");

            var exists = await _context.RouteStops.AnyAsync(r =>
                r.RouteId == dto.RouteId &&
                r.BusStopId == dto.BusStopId);

            if (exists)
                throw new Exception("This bus stop is already assigned to this route.");

            var routeStop = new RouteStop
            {
                RouteId = dto.RouteId,
                BusStopId = dto.BusStopId,
                StopOrder = dto.StopOrder
            };

            _context.RouteStops.Add(routeStop);
            await _context.SaveChangesAsync();

            return new RouteStopDto
            {
                Id = routeStop.Id,
                RouteId = route.Id,
                RouteName = route.RouteName,
                BusStopId = stop.Id,
                StopName = stop.StopName,
                StopOrder = routeStop.StopOrder
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateRouteStopDto dto)
        {
            var routeStop = await _context.RouteStops.FindAsync(id);

            if (routeStop == null)
                return false;

            routeStop.RouteId = dto.RouteId;
            routeStop.BusStopId = dto.BusStopId;
            routeStop.StopOrder = dto.StopOrder;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var routeStop = await _context.RouteStops.FindAsync(id);

            if (routeStop == null)
                return false;

            _context.RouteStops.Remove(routeStop);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}