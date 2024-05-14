using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class Account
{
    public int AccountId { get; set; }

    public string? Username { get; set; }

    public string? UserPassword { get; set; }

    public string? UserImage { get; set; }

    public int? UserId { get; set; }

    public int? AccountTypeId { get; set; }

    public virtual AccountType? AccountType { get; set; }

    public virtual User? User { get; set; }
}
