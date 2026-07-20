using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.Models;

namespace SmartBusTracking.API.Services
{
    public class PassengerService
    {
        private readonly ApplicationDbContext _context;

        public PassengerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PassengerDto>> GetAllAsync()
        {
            return await _context.Passengers
                .Select(p => new PassengerDto
                {
                    Id = p.Id,
                    FullName = p.FullName,
                    Email = p.Email,
                    PhoneNumber = p.PhoneNumber
                })
                .ToListAsync();
        }

        public async Task<PassengerDto?> GetByIdAsync(int id)
        {
            return await _context.Passengers
                .Where(p => p.Id == id)
                .Select(p => new PassengerDto
                {
                    Id = p.Id,
                    FullName = p.FullName,
                    Email = p.Email,
                    PhoneNumber = p.PhoneNumber
                })
                .FirstOrDefaultAsync();
        }

        public async Task<PassengerDto> CreateAsync(CreatePassengerDto dto)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("Email already exists.");

            string defaultPassword = "123456";

            // Create User
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(defaultPassword),
                RoleId = 3 // Passenger
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create Passenger linked to User
            var passenger = new Passenger
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                UserId = user.Id
            };

            _context.Passengers.Add(passenger);
            await _context.SaveChangesAsync();

            return new PassengerDto
            {
                Id = passenger.Id,
                FullName = passenger.FullName,
                Email = passenger.Email,
                PhoneNumber = passenger.PhoneNumber
            };
        }
        public async Task<bool> UpdateAsync(int id, UpdatePassengerDto dto)
        {
            var passenger = await _context.Passengers.FindAsync(id);

            if (passenger == null)
                return false;

            passenger.FullName = dto.FullName;
            passenger.Email = dto.Email;
            passenger.PhoneNumber = dto.PhoneNumber;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var passenger = await _context.Passengers.FindAsync(id);

            if (passenger == null)
                return false;

            _context.Passengers.Remove(passenger);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}