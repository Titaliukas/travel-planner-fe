using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Ratings1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.CreateTable(
        name: "Ratings",
        columns: table => new
        {
            Id = table.Column<int>(type: "int", nullable: false)
                .Annotation("SqlServer:Identity", "1, 1"),
            Score = table.Column<int>(type: "int", nullable: false),
            Date = table.Column<DateTime>(type: "datetime2", nullable: false),
            UserId = table.Column<int>(type: "int", nullable: false),
            SightId = table.Column<int>(type: "int", nullable: false)
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

    migrationBuilder.CreateIndex(
        name: "IX_Ratings_SightId",
        table: "Ratings",
        column: "SightId");

    migrationBuilder.CreateIndex(
        name: "IX_Ratings_UserId",
        table: "Ratings",
        column: "UserId");
}

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
