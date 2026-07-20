using Microsoft.EntityFrameworkCore;
using SmartBusTracking.API.Models;

namespace SmartBusTracking.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<Role> Roles { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<Bus> Buses { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<BusRoute> Routes { get; set; }
        public DbSet<BusStop> BusStops { get; set; }
        public DbSet<RouteStop> RouteStops { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<BusLocation> BusLocations { get; set; }
        public DbSet<Passenger> Passengers { get; set; }

        public DbSet<Notification> Notifications { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Driver>()
                .HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Passenger>()
    .HasOne(p => p.User)
    .WithMany()
    .HasForeignKey(p => p.UserId)
    .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BusStop>()
    .HasOne(b => b.Route)
    .WithMany()
    .HasForeignKey(b => b.RouteId)
    .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "Driver" },
                new Role { Id = 3, Name = "Passenger" }
            );
        }
    }
}
