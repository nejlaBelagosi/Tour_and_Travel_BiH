using Microsoft.ML.Data;
namespace TourAndTravelBiH
{
    public class PackageRatingData
    {
        public class PackageRating
        {
            [LoadColumn(0)]
            public float userId;
            [LoadColumn(1)]
            public float packageId;
            [LoadColumn(2)]
            public float Rating;
            [LoadColumn(3)]
            public float timestamp;
        }

        public class PackageRatingPrediction
        {
          //  public float Rating;
            public float Score;
            public float packageId;
        }
    }
}
