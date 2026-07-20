using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Models;
using BCrypt.Net;
using SmartBusTracking.API.DTOs.Driver;

namespace SmartBusTracking.API.Services
{
    public class DriverService
    {
        private readonly ApplicationDbContext _context;
        private readonly AuditLogService _auditLogService;

        public DriverService(
         ApplicationDbContext context,
         AuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        // Get All Drivers
        // Get All Drivers
        public async Task<List<DriverDto>> GetAllAsync()
        {
            return await _context.Drivers
                .Include(d => d.Trips)
                .Select(d => new DriverDto
                {
                    Id = d.Id,
                    DriverName = d.DriverName,
                    LicenseNumber = d.LicenseNumber,
                    PhoneNumber = d.PhoneNumber,
                    Experience = d.Experience,

                    // Dynamic Status
                    Status = d.Trips != null && d.Trips.Any(t => t.Status == "Running")
                                ? "Not Available"
                                : "Available"
                })
                .ToListAsync();
        }
        // Get Driver By Id
        // Get Driver By Id
        public async Task<DriverDto?> GetByIdAsync(int id)
        {
            return await _context.Drivers
                .Include(d => d.Trips)
                .Where(d => d.Id == id)
                .Select(d => new DriverDto
                {
                    Id = d.Id,
                    DriverName = d.DriverName,
                    LicenseNumber = d.LicenseNumber,
                    PhoneNumber = d.PhoneNumber,
                    Experience = d.Experience,

                    // Dynamic Status
                    Status = d.Trips != null && d.Trips.Any(t => t.Status == "Running")
                                ? "Not Available"
                                : "Available"
                })
                .FirstOrDefaultAsync();
        }

        // Add Driver



        public async Task<CreateDriverResponseDto> CreateAsync(CreateDriverDto dto)
        {
            // Generate email from driver's name
            string baseName = dto.DriverName
                .ToLower()
                .Replace(" ", "");

            string email = $"{baseName}@gmail.com";

            int number = 2;

            while (await _context.Users.AnyAsync(u => u.Email == email))
            {
                email = $"{baseName}{number}@gmail.com";
                number++;
            }

            // Default password
            string defaultPassword = "123456";

            // Create User
            var user = new User
            {
                FullName = dto.DriverName,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(defaultPassword),
                RoleId = 2 // Driver
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();



            // Create Driver linked to User
            var driver = new Driver
            {
                DriverName = dto.DriverName,
                LicenseNumber = dto.LicenseNumber,
                PhoneNumber = dto.PhoneNumber,
                Experience = dto.Experience,
                IsAvailable = dto.IsAvailable,

                UserId = user.Id
            };

            _context.Drivers.Add(driver);

            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    1,
    "Admin",
    "Created Driver",
    $"Added driver {driver.DriverName}"
);

            return new CreateDriverResponseDto
            {
                Message = $"Driver {driver.DriverName} added successfully.",

                Email = email,

                Password = defaultPassword
            };
        }
 

// Update Driver
public async Task<bool> UpdateAsync(int id, UpdateDriverDto dto)
        {
            var driver = await _context.Drivers.FindAsync(id);

            if (driver == null)
                return false;

            driver.DriverName = dto.DriverName;
            driver.LicenseNumber = dto.LicenseNumber;
            driver.PhoneNumber = dto.PhoneNumber;
            driver.Experience = dto.Experience;
            driver.IsAvailable = dto.IsAvailable;

            await _context.SaveChangesAsync();
            await _auditLogService.LogActionAsync(
    1,
    "Admin",
    "Updated Driver",
    $"Updated driver {driver.DriverName}"
);

            return true;
        }

        // Delete Driver
        public async Task<bool> DeleteAsync(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);

            if (driver == null)
                return false;

            string driverName = driver.DriverName;

            _context.Drivers.Remove(driver);
            await _context.SaveChangesAsync();

            await _auditLogService.LogActionAsync(
    1,
    "Admin",
    "Deleted Driver",
    $"Deleted driver {driverName}"
);

            return true;
        }
    }
}