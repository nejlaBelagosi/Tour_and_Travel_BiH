using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TourAndTravelBiH.Models;

public partial class DbTourAndTravelBiHContext : DbContext
{
    public DbTourAndTravelBiHContext()
    {
    }

    public DbTourAndTravelBiHContext(DbContextOptions<DbTourAndTravelBiHContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<AccountType> AccountTypes { get; set; }

    public virtual DbSet<Destination> Destinations { get; set; }

    public virtual DbSet<Favorite> Favorites { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Reservation> Reservations { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<TourPackage> TourPackages { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-MAC1B56\\MSSQLSERVER02;Database=db_Tour_and_Travel_BiH;Trusted_Connection=True; TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__ACCOUNT__290C88E4651B14FD");

            entity.ToTable("ACCOUNT");

            entity.Property(e => e.AccountId).ValueGeneratedNever();
            entity.Property(e => e.UserImage)
                .HasMaxLength(50)
                .HasColumnName("userImage");
            entity.Property(e => e.UserPassword).HasMaxLength(50);
            entity.Property(e => e.Username).HasMaxLength(50);

            entity.HasOne(d => d.AccountType).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.AccountTypeId)
                .HasConstraintName("FK__ACCOUNT__Account__66603565");

            entity.HasOne(d => d.User).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__ACCOUNT__UserId__59063A47");
        });

        modelBuilder.Entity<AccountType>(entity =>
        {
            entity.HasKey(e => e.AccountTypeId).HasName("PK__ACCOUNT___8F9585AFAEA957E1");

            entity.ToTable("ACCOUNT_TYPES");

            entity.Property(e => e.AccountTypeId).ValueGeneratedNever();
            entity.Property(e => e.UserType)
                .HasMaxLength(1)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Destination>(entity =>
        {
            entity.HasKey(e => e.DestinationId).HasName("PK__DESTINAT__DB5FE4CCE486B4F2");

            entity.ToTable("DESTINATIONS");

            entity.Property(e => e.DestinationId).ValueGeneratedNever();
            entity.Property(e => e.DestinationImage).HasMaxLength(50);
            entity.Property(e => e.DestinationLocation).HasMaxLength(50);
            entity.Property(e => e.DestinationName).HasMaxLength(50);
        });

        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(e => e.FavoriteItemId).HasName("PK__FAVORITE__19436E00D5EF7759");

            entity.ToTable("FAVORITES");

            entity.Property(e => e.FavoriteItemId).ValueGeneratedNever();

            entity.HasOne(d => d.Package).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.PackageId)
                .HasConstraintName("FK__FAVORITES__Packa__59FA5E80");

            entity.HasOne(d => d.User).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__FAVORITES__UserI__5AEE82B9");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__PAYMENTS__9B556A385A67FD97");

            entity.ToTable("PAYMENTS");

            entity.Property(e => e.PaymentId).ValueGeneratedNever();
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.TotalCost).HasColumnType("money");

            entity.HasOne(d => d.Reservation).WithMany(p => p.Payments)
                .HasForeignKey(d => d.ReservationId)
                .HasConstraintName("FK__PAYMENTS__Reserv__5BE2A6F2");
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("PK__RESERVAT__B7EE5F24A698ECC0");

            entity.ToTable("RESERVATIONS");

            entity.Property(e => e.ReservationId).ValueGeneratedNever();
            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.ReservationStatus)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.TotalPrice).HasColumnType("money");

            entity.HasOne(d => d.Package).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.PackageId)
                .HasConstraintName("FK__RESERVATI__Packa__5CD6CB2B");

            entity.HasOne(d => d.User).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__RESERVATI__UserI__5DCAEF64");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__REVIEWS__74BC79CE14C95ED4");

            entity.ToTable("REVIEWS");

            entity.Property(e => e.ReviewId).ValueGeneratedNever();
            entity.Property(e => e.ReviewComment)
                .HasMaxLength(300)
                .IsUnicode(false);

            entity.HasOne(d => d.Reservation).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.ReservationId)
                .HasConstraintName("FK__REVIEWS__Reserva__628FA481");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__REVIEWS__UserId__5FB337D6");
        });

        modelBuilder.Entity<TourPackage>(entity =>
        {
            entity.HasKey(e => e.PackageId).HasName("PK__TOUR_PAC__322035CCED8F4B64");

            entity.ToTable("TOUR_PACKAGES");

            entity.Property(e => e.PackageId).ValueGeneratedNever();
            entity.Property(e => e.Accomodation)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.PackageDescription).HasMaxLength(300);
            entity.Property(e => e.Price).HasColumnType("money");

            entity.HasOne(d => d.Destination).WithMany(p => p.TourPackages)
                .HasForeignKey(d => d.DestinationId)
                .HasConstraintName("FK__TOUR_PACK__Desti__60A75C0F");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__USERS__1788CC4C418B6030");

            entity.ToTable("USERS");

            entity.Property(e => e.UserId).ValueGeneratedNever();
            entity.Property(e => e.Address).HasMaxLength(50);
            entity.Property(e => e.Contact).HasMaxLength(15);
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Surname)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
