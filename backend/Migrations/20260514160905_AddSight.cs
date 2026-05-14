using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSight : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Sights",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: false),
                    CoordinateX = table.Column<double>(type: "float", nullable: false),
                    CoordinateY = table.Column<double>(type: "float", nullable: false),
                    PhotoUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sights", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Interests",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Gamta");

            migrationBuilder.UpdateData(
                table: "Interests",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Maistas");

            migrationBuilder.UpdateData(
                table: "Interests",
                keyColumn: "Id",
                keyValue: 7,
                column: "Name",
                value: "Skaitymas");

            migrationBuilder.UpdateData(
                table: "Interests",
                keyColumn: "Id",
                keyValue: 8,
                column: "Name",
                value: "Viduramžiai");

            migrationBuilder.UpdateData(
                table: "Interests",
                keyColumn: "Id",
                keyValue: 10,
                column: "Name",
                value: "Menas");

            migrationBuilder.InsertData(
                table: "Sights",
                columns: new[] { "Id", "Address", "City", "CoordinateX", "CoordinateY", "Description", "Duration", "FullDescription", "Name", "PhotoUrl" },
                values: new object[,]
                {
                    { 1, "Arsenalo g. 5, Vilnius", "Vilnius", 25.290299999999998, 54.686900000000001, "Simbolinė Vilniaus vieta su Gedimino bokštu ir nuostabia panorama.", 3600, "Gedimino kalnas – vienas svarbiausių Vilniaus simbolių. Ant kalno stūkso Gedimino pilies bokštas, iš kurio atsiveria nuostabi senojo Vilniaus panorama. Kalnas yra archeologinis, istorinis ir kultūrinis paminklas, pritraukiantis tūkstančius lankytojų kasmet.", "Gedimino kalnas", "https://upload.wikimedia.org/wikipedia/commons/9/9d/Gedimino_pilis_by_Augustas_Didzgalvis.jpg" },
                    { 2, "Jurgaičių kaimas", "Šiauliai", 23.4175, 56.0154, "Unikalus piligrimystės centras su tūkstančiais kryžių.", 3600, "Kryžių kalnas – vienas žinomiausių Lietuvos piligrimystės centrų, pritraukiantis tūkstančius lankytojų kasmet. Šis unikalus religinis kompleksas, kurį sudaro dešimtys tūkstančių kryžių, liudija lietuvių tautos tikėjimą ir pasiaukojimą. Vieta įtraukta į UNESCO paveldą.", "Kryžių kalnas", "https://www.turistopasaulis.lt/wp-content/uploads/2013/10/kry%C5%BEi%C5%B3-kalnas-05.jpg" },
                    { 3, "Kalnai parkas, Vilnius", "Vilnius", 25.299199999999999, 54.688400000000001, "Monumentalus paminklas su nuostabia miesto panorama.", 3600, "Trijų kryžių kalnas – vienas populiariausių Vilniaus apžvalgos taškų. Ant kalno stovi trys balti betoniniai kryžiai, pastatyti 1989 metais vietoje 1916 m. pastatytų medinių kryžių. Nuo kalno atsiveria įspūdinga Vilniaus senamiestis panorama.", "Trijų kryžių kalnas", "https://tobuladovana.lt/images/blog/5/triju-kryziu-kalnas.jpeg" },
                    { 4, "Karaimų g. 41, Trakai", "Trakai", 24.934699999999999, 54.6524, "Vienas gražiausių Lietuvos pilių kompleksų, esantis saloje Galvės ežere.", 7200, "Trakų salos pilis – vienas iš labiausiai turistų lankomas objektų Lietuvoje. Ši XIV a. pabaigoje pastatyta gotinė pilis yra vienintelė vandeniu apsuptų pilių Rytų Europoje. Čia įsikūręs Trakų istorijos muziejus, vyksta įvairūs renginiai ir festivaliai.", "Trakų pilis", "https://upload.wikimedia.org/wikipedia/commons/7/77/Traku_pilis_by_Augustas_Didzgalvis.jpg" },
                    { 5, "Puntuko akmens takas, Anykščiai", "Anykščiai", 25.116700000000002, 55.533299999999997, "Didžiausias riedulys Lietuvoje, apipintas legendomis.", 3600, "Puntuko akmuo – didžiausias riedulys Lietuvoje, kurio tūris siekia 265 kubinių metrų. Šis unikalus gamtos paminklas apipintas daugybe legendų ir pasakojimų. Akmuo yra populiari turistų lankoma vieta Anykščių rajone.", "Puntuko akmuo", "https://upload.wikimedia.org/wikipedia/lt/b/b6/LT_Anyksciai_Puntukas_01.jpg" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Sights");

            migrationBuilder.UpdateData(
                table: "Interests",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Žygiai");

            migrationBuilder.UpdateData(
                table: "Interests",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Maisto gaminimas");

            migrationBuilder.UpdateData(
                table: "Interests",
                keyColumn: "Id",
                keyValue: 7,
                column: "Name",
                value: "Skaitau knygas");

            migrationBuilder.UpdateData(
                table: "Interests",
                keyColumn: "Id",
                keyValue: 8,
                column: "Name",
                value: "Kelionės");

            migrationBuilder.UpdateData(
                table: "Interests",
                keyColumn: "Id",
                keyValue: 10,
                column: "Name",
                value: "Meno galerijos");
        }
    }
}
