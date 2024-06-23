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

    public virtual DbSet<AuthenticationToken> AuthenticationTokens { get; set; }

    public virtual DbSet<Destination> Destinations { get; set; }

    public virtual DbSet<Favorite> Favorites { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Reservation> Reservations { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<TourPackage> TourPackages { get; set; }

    public virtual DbSet<TourPackageDate> TourPackageDates { get; set; }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Session> Sessions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-MAC1B56\\MSSQLSERVER02;Database=db_Tour_and_Travel_BiH;Trusted_Connection=True;Encrypt=false");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__tmp_ms_x__349DA5A6D8B64335");

            entity.ToTable("ACCOUNT");

            entity.Property(e => e.UserImage).HasColumnName("userImage");
            entity.Property(e => e.UserPassword).HasMaxLength(50);
            entity.Property(e => e.Username).HasMaxLength(50);

            entity.HasOne(d => d.AccountType).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.AccountTypeId)
                .HasConstraintName("FK__ACCOUNT__Account__2180FB33");

            entity.HasOne(d => d.User).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__ACCOUNT__UserId__208CD6FA");
        });

        modelBuilder.Entity<AccountType>(entity =>
        {
            entity.HasKey(e => e.AccountTypeId).HasName("PK__tmp_ms_x__8F9585AFC5A18542");

            entity.ToTable("ACCOUNT_TYPE");

            entity.Property(e => e.UserType)
                .HasMaxLength(200)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AuthenticationToken>(entity =>
        {
            entity.HasKey(e => e.AuthenticationId).HasName("PK__tmp_ms_x__81919C7B6AFDE529");

            entity.ToTable("AUTHENTICATION_TOKEN");

            entity.Property(e => e.RecordingTime).HasColumnType("datetime");
            entity.Property(e => e.TokenValue).HasMaxLength(50);
            entity.Property(e => e.Username).HasMaxLength(50);

            entity.HasOne(d => d.Account).WithMany(p => p.AuthenticationTokens)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK__AUTHENTIC__Accou__2A164134");
        });

        modelBuilder.Entity<Destination>(entity =>
        {
            entity.HasKey(e => e.DestinationId).HasName("PK__tmp_ms_x__DB5FE4CC40094B54");

            entity.ToTable("DESTINATION");

            entity.Property(e => e.DestinationDetails).IsUnicode(false);
            entity.Property(e => e.DestinationLocation).HasMaxLength(50);
            entity.Property(e => e.DestinationName).HasMaxLength(50);
        });

        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(e => e.FavoriteItemId).HasName("PK__tmp_ms_x__19436E00C47DDDC7");

            entity.ToTable("FAVORITE");

            entity.HasOne(d => d.Package).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.PackageId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__FAVORITE__Packag__19DFD96B");

            entity.HasOne(d => d.User).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__FAVORITE__UserId__1AD3FDA4");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__tmp_ms_x__9B556A38B7B17E21");

            entity.ToTable("PAYMENT");

            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.TotalCost).HasColumnType("money");

            entity.HasOne(d => d.Reservation).WithMany(p => p.Payments)
                .HasForeignKey(d => d.ReservationId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__PAYMENT__Reserva__245D67DE");
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("PK__tmp_ms_x__B7EE5F2426231538");

            entity.ToTable("RESERVATION");

            entity.Property(e => e.ReservationStatus)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.TotalPrice).HasColumnType("money");

            entity.HasOne(d => d.TourPackageDates)
                              .WithMany(p => p.Reservations)
                              .HasForeignKey(e => e.DateId)
                              .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Package).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.PackageId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__RESERVATI__Packa__160F4887");

            entity.HasOne(d => d.User).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__RESERVATI__UserI__151B244E");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__tmp_ms_x__74BC79CE0D4CCA41");

            entity.ToTable("REVIEW");

            entity.Property(e => e.ReviewComment)
                .HasMaxLength(300)
                .IsUnicode(false);

            entity.HasOne(d => d.Reservation).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.ReservationId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__REVIEW__Reservat__14270015");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__REVIEW__UserId__0B91BA14");
        });

        modelBuilder.Entity<TourPackage>(entity =>
        {
            entity.HasKey(e => e.PackageId).HasName("PK__tmp_ms_x__322035CC83F5889A");

            entity.ToTable("TOUR_PACKAGE");

            entity.Property(e => e.Accomodation)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.AdditionalInformations).IsUnicode(false);
            entity.Property(e => e.PackageDescription).IsUnicode(false);
            entity.Property(e => e.Price).HasColumnType("money");
            entity.Property(e => e.TourHighlights).IsUnicode(false);

            entity.HasOne(d => d.Destination).WithMany(p => p.TourPackages)
                .HasForeignKey(d => d.DestinationId)
                .HasConstraintName("FK__TOUR_PACK__Desti__114A936A");
        });

        modelBuilder.Entity<TourPackageDate>(entity =>
        {
            entity.HasKey(e => e.DateId).HasName("PK__TOUR_PAC__A426F23337A86CE2");

            entity.ToTable("TOUR_PACKAGE_DATE");

            entity.HasOne(d => d.Package).WithMany(p => p.TourPackageDates)
                .HasForeignKey(d => d.PackageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TOUR_PACK__Packa__6442E2C9");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__tmp_ms_x__1788CC4C3150C90E");

            entity.ToTable("USER");

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
        modelBuilder.Entity<Session>()
    .HasOne(s => s.User)
    .WithMany(u => u.Sessions)
    .HasForeignKey(s => s.UserId);

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
