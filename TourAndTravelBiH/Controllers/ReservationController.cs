using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            var reservation = _db.Reservations.ToList();
            return Ok(reservation);
        }

        [HttpPost]
        public IActionResult PostReservation([FromBody] Reservation reservation)
        {
            Reservation newReservation = new Reservation();
            // newReservation.ReservationId = reservation.ReservationId; => id se automatski generise
            newReservation.TotalTravelers = reservation.TotalTravelers;
            newReservation.DateOfReservation = reservation.DateOfReservation;
            newReservation.TotalPrice = reservation.TotalPrice;
            newReservation.UserId = reservation.UserId;
            newReservation.PackageId = reservation.PackageId;
            newReservation.ReservationStatus = reservation.ReservationStatus;

            _db.Add(newReservation);
            _db.SaveChanges();
            return Ok(newReservation);
        }

        // korisnik moze editovati ukupan broj putnika, total price se automatski mijenja, status
        [HttpPut("{id:int}")]
        public IActionResult UpdateUser([FromBody] Reservation data, int id)
        {
            var editReservation = _db.Reservations.Find(id);
            if (data == null)
            {
                return BadRequest("Reservation not found!");
            }            
            editReservation.TotalTravelers = data.TotalTravelers;
            editReservation.TotalPrice = data.TotalPrice;
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
            return Ok("Reservation edited");
        }
        [HttpDelete("{id:int}")]
        public IActionResult DeleteReservation( int id)
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
