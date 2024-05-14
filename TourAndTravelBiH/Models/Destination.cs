using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class Destination
{
    public int DestinationId { get; set; }

    public string? DestinationLocation { get; set; }

    public string? DestinationName { get; set; }

    public string? DestinationImage { get; set; }

    public string? DestinationDetails { get; set; }

    public virtual ICollection<TourPackage> TourPackages { get; set; } = new List<TourPackage>();
}
