using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TourAndTravelBiH.Helper;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly DbTourAndTravelBiHContext _db;
        public ReservationController(DbTourAndTravelBiHContext db)
        {
            _db = db;
        }
        // dohvacanje rezervacija, pregled mogu imati registrovani korisnici i admin
        [HttpGet]
        public IActionResult GetReservation()
        {
            var reservations = _db.Reservations
                .Include(p => p.User)
                .Include(p => p.Package)
                .ThenInclude(p => p.Destination)
                .Include(p => p.TourPackageDates) // Include the TourPackageDate
                .ToList();

            var result = reservations.Select(p => new
            {
                p.ReservationId,
                p.TotalTravelers,
                p.DateOfReservation,
                p.TotalPrice,
                p.ReservationStatus,
                username = p.User.Name + ' ' + p.User.Surname,
                packageDescription = p.Package.PackageDescription,
                destinationName = p.Package.Destination.DestinationName,
               startDate = p.TourPackageDates.StartDate, // Correctly map start date
                endDate = p.TourPackageDates.EndDate // Correctly map end date
            }).ToList();

            return Ok(result);
        }

        //dohvacanje prema userId
        [HttpGet("{userId}")]
        public IActionResult GetReservationsByUserId(int userId)
        {
            var reservations = _db.Reservations
                .Include(r => r.Package)
                .ThenInclude(r => r.Destination)
                .Include(r => r.TourPackageDates)
                          .Include(r => r.Package) // assuming there is a relationship between Reservation and TourPackage
                          .Where(r => r.UserId == userId)
                          .Select(r => new
                          {
                              r.ReservationId,
                              r.UserId,
                              r.PackageId,
                              r.TotalTravelers,
                              r.DateOfReservation,
                              r.TotalPrice,
                              r.ReservationStatus,
                              destinationName = r.Package.Destination.DestinationName, // assuming nested relationship
                              destinationImage = r.Package.Destination.DestinationImage,
                              startDate = r.TourPackageDates.StartDate,
                              endDate = r.TourPackageDates.EndDate
                          })

                          .ToList();

            if (reservations == null || reservations.Count == 0)
            {
                return NotFound("No reservations found for this user.");
            }
            return Ok(reservations);
        }

        [HttpGet("{packageId}")]
        public IActionResult GetPackageDates(int packageId)
        {
            var dates = _db.TourPackageDates
                .Where(d => d.PackageId == packageId)
                .Select(d => new
                {
                    d.DateId,
                    d.StartDate,
                    d.EndDate
                })
                .ToList();

            return Ok(dates);
        }



        [HttpPost]
        public IActionResult PostReservation([FromBody] Reservation reservation)
        {
            if (reservation.DateId == null)
            {
                return BadRequest("DateId is required.");
            }

            // Retrieve the TourPackageDate entity using the provided DateId
            var tourPackageDate = _db.TourPackageDates
                .FirstOrDefault(d => d.DateId == reservation.DateId);

            Reservation newReservation = new Reservation
            {
                TotalTravelers = reservation.TotalTravelers,
                DateOfReservation = reservation.DateOfReservation,
                TotalPrice = reservation.TotalPrice,
                UserId = reservation.UserId,
                PackageId = reservation.PackageId,
                ReservationStatus = reservation.ReservationStatus,
                DateId = reservation.DateId,
            };

            _db.Add(newReservation);
            _db.SaveChanges();
            return Ok(newReservation);
        }


        // korisnik moze editovati ukupan broj putnika, total price se automatski mijenja, status
        [HttpPut("{id:int}")]
        public IActionResult UpdateReservation([FromBody] Reservation data, int id)
        {
            var editReservation = _db.Reservations.Find(id);
            if (editReservation == null)
            {
                return BadRequest("Reservation not found!");
            }
            editReservation.TotalTravelers = data.TotalTravelers;
            editReservation.TotalPrice = data.TotalPrice;
            editReservation.DateOfReservation = data.DateOfReservation;
            editReservation.ReservationStatus = data.ReservationStatus;

            if(data.DateId != null && data.DateId != 0)
            {
            editReservation.DateId = data.DateId;
            }

            if (data.UserId != null && data.UserId != 0)
            {
                editReservation.UserId = data.UserId;
            }

            if (data.PackageId != null && data.PackageId != 0)
            {
                editReservation.PackageId = data.PackageId;
            }



            _db.SaveChanges();
            return Ok(editReservation);
        }
        [HttpDelete("{id:int}")]
        public IActionResult DeleteReservation([FromRoute] int id)
        {
            Reservation reservationData = _db.Reservations.Where(a => a.ReservationId == id).FirstOrDefault();
            if (reservationData == null)
            {
                return NotFound("Reservation is not found in Database.");
            }

            _db.Remove(reservationData);
            _db.SaveChanges();

            return Ok(reservationData);

        }
    }

}