using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public string? PaymentMethod { get; set; }

    public decimal? TotalCost { get; set; }

    public DateOnly TransactionDate { get; set; }

    public bool? TransactionStatus { get; set; }

    public int? ReservationId { get; set; }

    public virtual Reservation? Reservation { get; set; }
}
