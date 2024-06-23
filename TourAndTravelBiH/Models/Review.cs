using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class Review
{
    public int ReviewId { get; set; }

    public DateOnly? PostDate { get; set; }

    public string? ReviewComment { get; set; }

    public int? Rating { get; set; }

    public int? UserId { get; set; }

    public int? ReservationId { get; set; }

    public virtual Reservation? Reservation { get; set; }

    public virtual User? User { get; set; }
}
