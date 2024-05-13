using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class AccountType
{
    public int AccountTypeId { get; set; }

    public string? UserType { get; set; }

    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}
