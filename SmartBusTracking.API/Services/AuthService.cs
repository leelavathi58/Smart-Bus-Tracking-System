using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SmartBusTracking.API.Data;
using SmartBusTracking.API.DTOs;
using SmartBusTracking.API.DTOs.Auth;
using SmartBusTracking.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SmartBusTracking.API.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly AuditLogService _auditLogService;

        public AuthService(
          ApplicationDbContext context,
          IConfiguration configuration,
          AuditLogService auditLogService)
        {
            _context = context;
            _configuration = configuration;
            _auditLogService = auditLogService;
        }

        public async Task<string> RegisterAsync(RegisterRequestDto dto)
        {
            // Check if email already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existingUser != null)
                return "Email already exists.";

            // Create new user
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                PhoneNumber = dto.PhoneNumber,
                RoleId = dto.RoleId,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return "User registered successfully.";
        }

        public async Task<LoginResponseDto> RegisterPassengerAsync(PassengerRegisterDto dto)
        {
            // Check if email already exists
            var existingUser = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existingUser != null)
            {
                throw new Exception("This email is already registered. Please use Login instead.");
            }

            // Find Passenger Role
            var passengerRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == "Passenger");

            if (passengerRole == null)
            {
                throw new Exception("Passenger role not found.");
            }

            // Create User
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),

                // Save phone number here too (optional but recommended)
                PhoneNumber = dto.PhoneNumber,

                RoleId = passengerRole.Id,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Create Passenger
            var passenger = new Passenger
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                UserId = user.Id
            };

            _context.Passengers.Add(passenger);
            await _context.SaveChangesAsync();

            // Load Role for JWT
            user.Role = passengerRole;

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.FullName),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, passengerRole.Name)
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(
                    Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])
                ),
                signingCredentials: credentials
            );

            return new LoginResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                FullName = user.FullName,
                Email = user.Email,
                Role = passengerRole.Name
            };
        }
        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
        {

            
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                throw new Exception("Invalid email or password.");

            bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!validPassword)
                throw new Exception("Invalid email or password.");

            Console.WriteLine("=================================");
            Console.WriteLine($"Selected Role : {dto.SelectedRole}");
            Console.WriteLine($"Database Role : {user.Role?.Name}");
            Console.WriteLine("=================================");

            // NEW ROLE VALIDATION
            if (!string.Equals(user.Role!.Name, dto.SelectedRole, StringComparison.OrdinalIgnoreCase))
            {
                throw new Exception($"This account is not registered as {dto.SelectedRole}.");
            }

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.FullName),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role.Name)
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(
                    Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])
                ),
                signingCredentials: credentials
            );

            await _auditLogService.LogActionAsync(
    user.Id,
    user.FullName,
    "Login",
    $"{user.FullName} logged into the system as {user.Role.Name}."
);

            return new LoginResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.Name
            };
        }
        public async Task<ProfileDto?> GetProfileAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            string? phoneNumber = user.PhoneNumber;

            if (user.Role!.Name == "Driver")
            {
                phoneNumber = await _context.Drivers
                    .Where(d => d.UserId == userId)
                    .Select(d => d.PhoneNumber)
                    .FirstOrDefaultAsync();
            }
            else if (user.Role.Name == "Passenger")
            {
                phoneNumber = await _context.Passengers
                    .Where(p => p.UserId == userId)
                    .Select(p => p.PhoneNumber)
                    .FirstOrDefaultAsync();
            }

            return new ProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = phoneNumber,
                Role = user.Role.Name,
                CreatedAt = user.CreatedAt
            };
        }
        public async Task<string> ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return "User not found.";

            bool valid = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash);

            if (!valid)
                return "Current password is incorrect.";

            if (dto.NewPassword != dto.ConfirmPassword)
                return "New password and Confirm password do not match.";

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            await _context.SaveChangesAsync();

            return "Password changed successfully.";
        }
    }
}
