using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartBusTracking.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAverageSpeedToRoute : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AverageSpeed",
                table: "Routes",
                type: "double",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AverageSpeed",
                table: "Routes");
        }
    }
}
