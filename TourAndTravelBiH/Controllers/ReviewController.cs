using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            var reviews = _db.Reviews
                .Include(p => p.User)
                .Include(p => p.Reservation)
                .ThenInclude(p => p.Package)
                .ThenInclude(p => p.Destination)
                .ToList();
            var result = reviews.Select(p => new
            {
                p.ReviewId,
                p.PostDate,
                p.Rating,
                p.ReviewComment,
                user = p.User.Name + " " + p.User.Surname,
                tourPackageId = p.Reservation.PackageId,
                destinationName = p.Reservation.Package.Destination.DestinationName


            });
            return Ok(result);
        }

        // dohvacanje reviews prema packageId
        [HttpGet("GetReviewByPackageId/{packageId:int}")]
        public IActionResult GetReviewByPackageId(int packageId)
        {
            var reviews = _db.Reviews
                .Include(p => p.User)
                .Include(p => p.Reservation)
                .Where(p => p.Reservation.PackageId == packageId)
                .ToList();
            var result = reviews.Select(p => new
            {
                p.ReviewId,
                p.PostDate,
                p.Rating,
                p.ReviewComment,
                user = p.User.Name + " " + p.User.Surname,
                tourPackageId = p.Reservation.PackageId
            });
            return Ok(result);
        }

        //dohvacanje reviews prema destinationName
        [HttpGet("GetReviewByDestinationName/{destinationName}")]
        public IActionResult GetReviewByDestinationName(string destinationName)
        {
            var reviews = _db.Reviews
                .Include(p => p.User)
                .Include(p => p.Reservation)
                .ThenInclude(r => r.Package)
                .ThenInclude(p => p.Destination)
                .Where(p => p.Reservation.Package.Destination.DestinationName == destinationName)
                .ToList();
            var result = reviews.Select(p => new
            {
                p.ReviewId,
                p.PostDate,
                p.Rating,
                p.ReviewComment,
                user = p.User.Name + " " + p.User.Surname,
                tourPackageId = p.Reservation.PackageId
            });
            return Ok(result);
        }
        [HttpGet("GetRatingByDestinationName/{destinationName}")]
        public IActionResult GetRatingByDestinationName(string destinationName)
        {
            var reviews = _db.Reviews
                .Include(p => p.User)
                .Include(p => p.Reservation)
                .ThenInclude(r => r.Package)
                .ThenInclude(p => p.Destination)
                .Where(p => p.Reservation.Package.Destination.DestinationName == destinationName)
                .ToList();

            var result = reviews.Select(p => new
            {
                p.ReviewId,
                p.PostDate,
                p.Rating,
                p.ReviewComment,
                user = p.User.Name + " " + p.User.Surname,
                tourPackageId = p.Reservation.PackageId
            }).ToList();

            double averageRating = reviews.Any() ? reviews.Average(p => (double)p.Rating) : 0.0;

            return Ok(new { reviews = result, averageRating });
        }

        //dodavanje review, ali modifikovati da ga mogu dodavati samo registrovani useri i useri ciji status
        //rezervacije je zavrsen i uplacen
        [HttpPost]
        public IActionResult PostReview([FromBody] Review review)

        {
            // Dohvati rezervaciju povezanu s recenzijom
            var reservation = _db.Reservations.FirstOrDefault(r => r.ReservationId == review.ReservationId);

            // Provjeri je li rezervacija pronađena i je li njezin status "završen" i je li uplata uplaćena
            if (reservation != null && reservation.ReservationStatus ==  "Zavrseno")
            {
                Review newReview = new Review();
                // newReview.ReviewId = review.ReviewId; => id se automatski generise
                newReview.PostDate = review.PostDate;
                newReview.ReviewComment = review.ReviewComment;
                newReview.Rating = review.Rating;
                newReview.UserId = review.UserId;
                newReview.ReservationId = review.ReservationId;

                _db.Add(newReview);
                _db.SaveChanges();
                return Ok(newReview);
            }
            else
            {
                // Ako rezervacija nije pronađena, ili nije završena ili uplata nije uplaćena, vrati odgovarajući odgovor
                return BadRequest("Recenziju nije moguće dodati. Provjerite status rezervacije.");
            }

        }
        //Uredjivanje review.Registrovani user nakon sto postavi review moze ga i urediti.
        [HttpPut("{id:int}")]
        public IActionResult UpdateReview([FromBody] Review data, int id)
        {
            var editReview = _db.Reviews.Find(id);
            if (editReview == null)
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
        public IActionResult DeleteReview( int id)
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