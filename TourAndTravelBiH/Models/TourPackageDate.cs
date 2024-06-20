using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class TourPackageDate
{
    public int DateId { get; set; }

    public int PackageId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public virtual TourPackage Package { get; set; } = null!;

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
