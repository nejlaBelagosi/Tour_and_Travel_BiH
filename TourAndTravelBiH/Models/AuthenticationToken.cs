using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class AuthenticationToken
{
    public int AuthenticationId { get; set; }

    public string? AuthenticationValue { get; set; }

    public DateTime? RecordingTime { get; set; }

    public string? Username { get; set; }

    public int? AccountId { get; set; }

    public virtual Account? Account { get; set; }
}
