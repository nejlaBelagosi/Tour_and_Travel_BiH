using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? Name { get; set; }

    public string? Surname { get; set; }

    public string? Address { get; set; }

    public string? DateOfBirth { get; set; }

    public string? Contact { get; set; }

    public string? Email { get; set; }

    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();

    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
