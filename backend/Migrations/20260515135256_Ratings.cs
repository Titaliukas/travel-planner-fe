using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Ratings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Routes_Trips_TripId",
                table: "Routes");

            migrationBuilder.DropIndex(
                name: "IX_Routes_TripId",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "TripId",
                table: "Routes");

            migrationBuilder.AddColumn<int>(
                name: "TripId",
                table: "Sights",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Sights",
                keyColumn: "Id",
                keyValue: 1,
                column: "TripId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Sights",
                keyColumn: "Id",
                keyValue: 2,
                column: "TripId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Sights",
                keyColumn: "Id",
                keyValue: 3,
                column: "TripId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Sights",
                keyColumn: "Id",
                keyValue: 4,
                column: "TripId",
                value: null);

            migrationBuilder.UpdateData(
                table: "Sights",
                keyColumn: "Id",
                keyValue: 5,
                column: "TripId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Sights_TripId",
                table: "Sights",
                column: "TripId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sights_Trips_TripId",
                table: "Sights",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id");
        }
    }
}
