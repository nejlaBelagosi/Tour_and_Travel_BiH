using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
        [Route("api/[controller]/[action]")]
        [ApiController]
        public class TourPackageDateController : ControllerBase
        {
            private readonly DbTourAndTravelBiHContext _db;

            public TourPackageDateController(DbTourAndTravelBiHContext db)
            {
                _db = db;
            }

            // Dohvaćanje svih datuma
            [HttpGet]
            public IActionResult GetAllDates()
            {
                var dates = _db.TourPackageDates.ToList();
                return Ok(dates);
            }

            // Dohvaćanje datuma po ID-u
            [HttpGet("{id:int}")]
            public IActionResult GetDateById(int id)
            {
                var date = _db.TourPackageDates.FirstOrDefault(d => d.DateId == id);
                if (date == null)
                {
                    return NotFound("Date not found");
                }
                return Ok(date);
            }

            // Dodavanje novog datuma
            [HttpPost]
            public IActionResult PostDate([FromBody] TourPackageDate date)
            {
                if (date == null)
                {
                    Console.WriteLine("Received null package");
                    return BadRequest("Invalid data");
                }

                // Logovanje za debagovanje
                Console.WriteLine($"Received date data: {JsonConvert.SerializeObject(date)}");
                // provjera da li paket vec postoji
                var existingDates = _db.TourPackageDates.FirstOrDefault();
                if (existingDates != null)
                {
                    return BadRequest("Paket već postoji.");
                }
                TourPackageDate newDates = new TourPackageDate();
                // newPackage.PackageId = package.PackageId; => id se automatski generise
                newDates.PackageId = date.PackageId;
                newDates.StartDate = date.StartDate;
                newDates.EndDate = date.EndDate;
                _db.Add(newDates);
                _db.SaveChanges();
                return Ok(newDates);

            }

            // Ažuriranje postojećeg datuma
            [HttpPut("{id:int}")]
            public IActionResult UpdateDate(int id, [FromBody] TourPackageDate updatedDate)
            {
                var existingDate = _db.TourPackageDates.FirstOrDefault(d => d.DateId == id);
                if (existingDate == null)
                {
                    return NotFound("Date not found");
                }

                existingDate.StartDate = updatedDate.StartDate;
                existingDate.EndDate = updatedDate.EndDate;
                existingDate.PackageId = updatedDate.PackageId;

                _db.SaveChanges();
                return Ok(existingDate);
            }

            // Brisanje datuma
            [HttpDelete("{id:int}")]
            public IActionResult DeleteDate(int id)
            {
                var date = _db.TourPackageDates.FirstOrDefault(d => d.DateId == id);
                if (date == null)
                {
                    return NotFound("Date not found");
                }

                _db.TourPackageDates.Remove(date);
                _db.SaveChanges();
                return Ok(date);
            }
        }
}


