using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class Destination
{
    public int DestinationId { get; set; }

    public string DestinationLocation { get; set; } = null!;

    public string DestinationName { get; set; } = null!;

    public string? DestinationImage { get; set; }

    public virtual ICollection<TourPackage> TourPackages { get; set; } = new List<TourPackage>();
}
