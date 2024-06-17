using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class TourPackage
{
    public int PackageId { get; set; }

    public bool? PackageAvailability { get; set; }

    public string? Accomodation { get; set; }

    public string? PackageDescription { get; set; }

    public decimal? Price { get; set; }

    public int? DestinationId { get; set; }

    public virtual Destination? Destination { get; set; }

    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

    public virtual ICollection<TourPackageDate> TourPackageDates { get; set; } = new List<TourPackageDate>();
}
