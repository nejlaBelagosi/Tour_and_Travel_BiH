using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly DbTourAndTravelBiHContext _db;
        public PaymentController(DbTourAndTravelBiHContext db)
        {
            _db = db;
        }

        // dohvacanje odredjenih atributa iz paymenta, koje kaasnije treba modifikovati tako da se dodaju 
        // automatski 
        [HttpGet]
        public IActionResult GetPaymentStatus()
        {
            var payments = _db.Payments
                    .Select(p => new
                    {
                        p.PaymentStatus,
                        p.TransactionStatus,
                        p.ReservationId,
                        p.TransactionDate,
                        p.TotalCost
                    })
                    .ToList();

            return Ok(payments);
        }
        

        // dodavanje korisnika od strane Admina. Ali ovaj post ce se modifikovati tako da se dodaju registrovani korisnici.
        [HttpPost]
        public IActionResult PostPayment([FromBody] Payment data)
        {
            _db.Payments.Add(new Payment
            {
               // PaymentId = data.PaymentId, => id se automatski generise
                PaymentMethod = data.PaymentMethod,
                TotalCost = data.TotalCost,
                TransactionDate = data.TransactionDate,
                TransactionStatus = data.TransactionStatus,
                ReservationId = data.ReservationId,
                PaymentStatus = data.PaymentStatus
            });

            _db.SaveChanges();
            return Ok("Uplata je uspjesno dodana");
        }
       

        
    }
}
