using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.DTOs.ETA;
using SmartBusTracking.API.Models;

namespace SmartBusTracking.API.Services
{
    public class BusLocationService
    {
        private readonly ApplicationDbContext _context;

        public BusLocationService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Update or Insert Bus Location
        public async Task<BusLocationDto> UpdateLocationAsync(CreateBusLocationDto dto)
        {
            var bus = await _context.Buses.FindAsync(dto.BusId);

            if (bus == null)
                throw new Exception("Bus not found.");

            var location = await _context.BusLocations
                .FirstOrDefaultAsync(x => x.BusId == dto.BusId);

            if (location == null)
            {
                location = new BusLocation
                {
                    BusId = dto.BusId,
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.BusLocations.Add(location);
            }
            else
            {
                location.Latitude = dto.Latitude;
                location.Longitude = dto.Longitude;
                location.UpdatedAt = DateTime.UtcNow;
            }

            // Automatically mark today's trip as Running
            var trip = await _context.Trips
    .Where(t => t.BusId == dto.BusId)
    .OrderByDescending(t => t.StartTime)
    .FirstOrDefaultAsync();

            if (trip != null && trip.Status != "Completed")
            {
                trip.Status = "Running";
            }

            await _context.SaveChangesAsync();

            return new BusLocationDto
            {
                Id = location.Id,
                BusId = bus.Id,
                BusNumber = bus.BusNumber,
                Latitude = location.Latitude,
                Longitude = location.Longitude,
                UpdatedAt = location.UpdatedAt
            };
        }

        // Get Current Location
        public async Task<BusLocationDto?> GetLocationAsync(int busId)
        {
            return await _context.BusLocations
                .Include(x => x.Bus)
                .Where(x => x.BusId == busId)
                .Select(x => new BusLocationDto
                {
                    Id = x.Id,
                    BusId = x.BusId,
                    BusNumber = x.Bus!.BusNumber,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    UpdatedAt = x.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }

        // Get All Bus Locations
        public async Task<List<BusLocationDto>> GetAllLocationsAsync()
        {
            return await _context.BusLocations
                .Include(x => x.Bus)
                .Select(x => new BusLocationDto
                {
                    Id = x.Id,
                    BusId = x.BusId,
                    BusNumber = x.Bus!.BusNumber,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    UpdatedAt = x.UpdatedAt
                })
                .ToListAsync();
        }

        public async Task<BusEtaDto> GetETAAsync(int busId)
        {
            var trip = await _context.Trips
    .Include(t => t.Bus)
    .Include(t => t.Route)
    .Where(t => t.BusId == busId && t.Status == "Running")
    .FirstOrDefaultAsync();

            if (trip == null)
                throw new Exception("No running trip found.");

            double totalDistance = trip.Route!.TotalDistance;

            double averageSpeed = trip.Route.AverageSpeed;

            if (averageSpeed <= 0)
                averageSpeed = 40;

            double remainingDistance = totalDistance / 2;

            int etaMinutes = (int)Math.Round(
                (remainingDistance / averageSpeed) * 60
            );

            return new BusEtaDto
            {
                BusNumber = trip.Bus!.BusNumber,
                RouteName = trip.Route.RouteName,
                TotalDistanceKm = totalDistance,
                RemainingDistanceKm = remainingDistance,
                AverageSpeed = averageSpeed,
                EstimatedMinutes = etaMinutes
            };
        }
    }
}