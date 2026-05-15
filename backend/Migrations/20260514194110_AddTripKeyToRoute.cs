using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTripKeyToRoute : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TripId",
                table: "Routes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Routes_TripId",
                table: "Routes",
                column: "TripId");

            migrationBuilder.AddForeignKey(
                name: "FK_Routes_Trips_TripId",
                table: "Routes",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
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
        }
    }
}
