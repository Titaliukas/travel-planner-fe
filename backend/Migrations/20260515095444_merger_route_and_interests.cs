using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class merger_route_and_interests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sights_Trips_TripId",
                table: "Sights");

            migrationBuilder.DropTable(
                name: "Ratings");

            migrationBuilder.DropIndex(
                name: "IX_Sights_TripId",
                table: "Sights");

            migrationBuilder.DropColumn(
                name: "TripId",
                table: "Sights");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TripId",
                table: "Sights",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Ratings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SightId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ratings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ratings_Sights_SightId",
                        column: x => x.SightId,
                        principalTable: "Sights",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Ratings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_SightId",
                table: "Ratings",
                column: "SightId");

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_UserId",
                table: "Ratings",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sights_Trips_TripId",
                table: "Sights",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id");
        }
    }
}
