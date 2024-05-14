using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly DbTourAndTravelBiHContext _db;
        public ReviewController(DbTourAndTravelBiHContext db)
        {
            _db = db;
        }
        // dohvacanje reviews, pregled i user i admin
        [HttpGet]
        public IActionResult GetReview()
        {
            var review = _db.Reviews.ToList();
            return Ok(review);
        }

        //dodavanje review, ali modifikovati da ga mogu dodavati samo registrovani useri i useri ciji status
        //rezervacije je zavrsen i uplacen
        [HttpPost]
        public IActionResult PostReview([FromBody] Review review)
        {
            Review newReview = new Review();
            newReview.ReviewId = review.ReviewId;
            newReview.PostDate = review.PostDate;
            newReview.ReviewComment = review.ReviewComment;
            newReview.Rating = review.Rating;
            newReview.UserId = review.UserId;
            newReview.ReservationId = review.ReservationId;

            _db.Add(newReview);
            _db.SaveChanges();
            return Ok(newReview);

        }
        //Uredjivanje review.Registrovani user nakon sto postavi review moze ga i urediti.
        [HttpPut("{id:int}")]
        public IActionResult UpdateReview([FromBody] Review data, int id)
        {
            var editReview = _db.Reviews.Find(id);
            if (data == null)
            {
                return BadRequest("Review not found!");
            }

            editReview.PostDate = data.PostDate;
            editReview.ReviewComment = data.ReviewComment;
            editReview.Rating = data.Rating;

            if (data.UserId != null && data.UserId != 0)
            {
                editReview.UserId = data.UserId;
            }
            if (data.ReservationId != null && data.ReservationId != 0)
            {
                editReview.ReservationId = data.ReservationId;
            }

            _db.SaveChanges();
            return Ok("Review edited");
        }
        //Brisanje review-a. Admin i user moze.
        [HttpDelete("{id:int}")]
        public IActionResult DeleteReview([FromBody] int id)
        {
            Review reviewData = _db.Reviews.Where(a => a.ReviewId == id).FirstOrDefault();
            if (reviewData == null)
            {
                return NotFound("Review is not found in Database.");
            }

            _db.Remove(reviewData);
            _db.SaveChanges();

            return Ok(reviewData);

        }
    }
}
