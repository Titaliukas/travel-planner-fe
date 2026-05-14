using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Interest> Interests => Set<Interest>();
    public DbSet<UserInterest> UserInterests => Set<UserInterest>();
    public DbSet<Sight> Sights { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Trip>()
            .HasOne(t => t.Owner)
            .WithMany(u => u.OwnedTrips)
            .HasForeignKey(t => t.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Trip>()
            .HasMany(t => t.Travelers)
            .WithMany(u => u.ParticipantTrips);

        modelBuilder.Entity<UserInterest>(entity =>
        {
            entity.HasKey(ui => ui.Id);

            entity.HasOne(ui => ui.User)
                .WithMany(u => u.UserInterests)
                .HasForeignKey(ui => ui.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ui => ui.Interest)
                .WithMany(i => i.UserInterests)
                .HasForeignKey(ui => ui.InterestId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(ui => new { ui.UserId, ui.InterestId }).IsUnique();
        });

        modelBuilder.Entity<Interest>().HasData(
            new Interest { Id = 1, Name = "Gamta" },
            new Interest { Id = 2, Name = "Plaukimas" },
            new Interest { Id = 3, Name = "Slidinėjimas" },
            new Interest { Id = 4, Name = "Fotografija" },
            new Interest { Id = 5, Name = "Maistas" },
            new Interest { Id = 6, Name = "Muzika" },
            new Interest { Id = 7, Name = "Skaitymas" },
            new Interest { Id = 8, Name = "Viduramžiai" },
            new Interest { Id = 9, Name = "Sportas" },
            new Interest { Id = 10, Name = "Menas" }
        );

        modelBuilder.Entity<Sight>().HasData(
        new Sight { 
            Id = 1, 
            Name = "Gedimino kalnas", 
            City = "Vilnius", 
            Address = "Arsenalo g. 5, Vilnius", 
            Description = "Simbolinė Vilniaus vieta su Gedimino bokštu ir nuostabia panorama.",
            FullDescription = "Gedimino kalnas – vienas svarbiausių Vilniaus simbolių. Ant kalno stūkso Gedimino pilies bokštas, iš kurio atsiveria nuostabi senojo Vilniaus panorama. Kalnas yra archeologinis, istorinis ir kultūrinis paminklas, pritraukiantis tūkstančius lankytojų kasmet.",
            Duration = 3600,
            CoordinateX = 25.2903,
            CoordinateY = 54.6869,
            PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/9/9d/Gedimino_pilis_by_Augustas_Didzgalvis.jpg"
        },
        new Sight { 
            Id = 2, 
            Name = "Kryžių kalnas", 
            City = "Šiauliai", 
            Address = "Jurgaičių kaimas", 
            Description = "Unikalus piligrimystės centras su tūkstančiais kryžių.", 
            FullDescription = "Kryžių kalnas – vienas žinomiausių Lietuvos piligrimystės centrų, pritraukiantis tūkstančius lankytojų kasmet. Šis unikalus religinis kompleksas, kurį sudaro dešimtys tūkstančių kryžių, liudija lietuvių tautos tikėjimą ir pasiaukojimą. Vieta įtraukta į UNESCO paveldą.", 
            Duration = 3600,
            CoordinateX = 23.4175, 
            CoordinateY = 56.0154, 
            PhotoUrl = "https://www.turistopasaulis.lt/wp-content/uploads/2013/10/kry%C5%BEi%C5%B3-kalnas-05.jpg" 
        },
        new Sight { 
            Id = 3, 
            Name = "Trijų kryžių kalnas", 
            City = "Vilnius", 
            Address = "Kalnai parkas, Vilnius", 
            Description = "Monumentalus paminklas su nuostabia miesto panorama.", 
            FullDescription = "Trijų kryžių kalnas – vienas populiariausių Vilniaus apžvalgos taškų. Ant kalno stovi trys balti betoniniai kryžiai, pastatyti 1989 metais vietoje 1916 m. pastatytų medinių kryžių. Nuo kalno atsiveria įspūdinga Vilniaus senamiestis panorama.", 
            Duration = 3600, 
            CoordinateX = 25.2992, 
            CoordinateY = 54.6884, 
            PhotoUrl = "https://tobuladovana.lt/images/blog/5/triju-kryziu-kalnas.jpeg"
        },
        new Sight { 
            Id = 4, 
            Name = "Trakų pilis", 
            City = "Trakai", 
            Address = "Karaimų g. 41, Trakai", 
            Description = "Vienas gražiausių Lietuvos pilių kompleksų, esantis saloje Galvės ežere.", 
            FullDescription = "Trakų salos pilis – vienas iš labiausiai turistų lankomas objektų Lietuvoje. Ši XIV a. pabaigoje pastatyta gotinė pilis yra vienintelė vandeniu apsuptų pilių Rytų Europoje. Čia įsikūręs Trakų istorijos muziejus, vyksta įvairūs renginiai ir festivaliai.", 
            Duration = 7200, 
            CoordinateX = 24.9347,
            CoordinateY = 54.6524, 
            PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/7/77/Traku_pilis_by_Augustas_Didzgalvis.jpg"
        },
        new Sight { 
            Id = 5, 
            Name = "Puntuko akmuo", 
            City = "Anykščiai", 
            Address = "Puntuko akmens takas, Anykščiai", 
            Description = "Didžiausias riedulys Lietuvoje, apipintas legendomis.", 
            FullDescription = "Puntuko akmuo – didžiausias riedulys Lietuvoje, kurio tūris siekia 265 kubinių metrų. Šis unikalus gamtos paminklas apipintas daugybe legendų ir pasakojimų. Akmuo yra populiari turistų lankoma vieta Anykščių rajone.", 
            Duration = 3600,
            CoordinateX = 25.1167, 
            CoordinateY = 55.5333, 
            PhotoUrl = "https://upload.wikimedia.org/wikipedia/lt/b/b6/LT_Anyksciai_Puntukas_01.jpg"
        }
    );
    }
}