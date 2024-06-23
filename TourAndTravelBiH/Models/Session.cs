namespace TourAndTravelBiH.Models
{
    public class Session
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int PageViews { get; set; }
        public int Engagements { get; set; }

        public virtual User? User { get; set; }
    }
}
