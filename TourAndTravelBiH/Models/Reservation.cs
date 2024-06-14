using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class Reservation
{
    public int ReservationId { get; set; }

    public int? TotalTravelers { get; set; }

    public DateOnly? DateOfReservation { get; set; }

    public decimal? TotalPrice { get; set; }

    public int? UserId { get; set; }

    public int? PackageId { get; set; }

    public string? ReservationStatus { get; set; }

    public virtual TourPackage? Package { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual User? User { get; set; }
}