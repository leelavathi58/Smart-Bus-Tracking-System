using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;

namespace SmartBusTracking.API.Services
{
    public class TrackingService
    {
        private readonly ApplicationDbContext _context;

        public TrackingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TrackBusDto>> GetBusesByRouteAsync(int routeId)
        {
            var trips = await _context.Trips
                .Include(t => t.Bus)
                .Include(t => t.Driver)
                .Include(t => t.Route)
                .Where(t =>
                    t.RouteId == routeId &&
                    t.Status != null &&
                    t.Status.Trim().ToLower() == "running")
                .ToListAsync();

            var result = new List<TrackBusDto>();

            foreach (var trip in trips)
            {
                // Get the current GPS location of this bus
                var location = await _context.BusLocations
                    .FirstOrDefaultAsync(x => x.BusId == trip.BusId);

                // Skip buses that haven't sent a location yet
                if (location == null)
                    continue;

                result.Add(new TrackBusDto
                {
                    BusId = trip.Bus!.Id,
                    BusNumber = trip.Bus.BusNumber,
                    BusName = trip.Bus.BusName,

                    DriverName = trip.Driver?.DriverName ?? "",

                    RouteName = trip.Route?.RouteName ?? "",
                    Source = trip.Route?.Source ?? "",
                    Destination = trip.Route?.Destination ?? "",

                    Latitude = location.Latitude,
                    Longitude = location.Longitude,

                    TripStatus = trip.Status
                });
            }

            return result;
        }
    }
}