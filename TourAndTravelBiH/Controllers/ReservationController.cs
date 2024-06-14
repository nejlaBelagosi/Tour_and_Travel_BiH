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
                destinationName = p.Package.Destination.DestinationName
            });
            return Ok(result);
        }

        //dohvacanje prema userId
        [HttpGet("{userId}")]
        public IActionResult GetReservationsByUserId(int userId)
        {
            var reservations = _db.Reservations
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
                              DestinationName = r.Package.Destination.DestinationName, // assuming nested relationship
                              DestinationImage = r.Package.Destination.DestinationImage
                          })
                          .ToList();

            if (reservations == null || reservations.Count == 0)
            {
                return NotFound("No reservations found for this user.");
            }
            return Ok(reservations);
        }


        [HttpPost]
        public IActionResult PostReservation([FromBody] Reservation reservation)
        {

            Reservation newReservation = new Reservation
            {
                TotalTravelers = reservation.TotalTravelers,
                DateOfReservation = reservation.DateOfReservation,
                TotalPrice = reservation.TotalPrice,
                UserId = reservation.UserId,
                PackageId = reservation.PackageId,
                ReservationStatus = reservation.ReservationStatus
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
            editReservation.ReservationStatus= data.ReservationStatus;
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