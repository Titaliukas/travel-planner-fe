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
    }
}