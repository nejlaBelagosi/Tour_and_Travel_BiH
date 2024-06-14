using System;
using System.Collections.Generic;

namespace TourAndTravelBiH.Models;

public partial class Favorite
{
    public int FavoriteItemId { get; set; }

    public int? PackageId { get; set; }

    public int? UserId { get; set; }

    public virtual TourPackage? Package { get; set; }

    public virtual User? User { get; set; }
    
}
