using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TourPackageController : ControllerBase
    {
        private readonly DbTourAndTravelBiHContext _db;
        public TourPackageController(DbTourAndTravelBiHContext db)
        {
            _db = db;
        }
        // dohvacanje svih paketa. 
        [HttpGet]
        public IActionResult GetPackage()
        {
            var package = _db.TourPackages.ToList();
            return Ok(package);
        }
        //dodavanje paketa na stranicu. SAMO ADMIN.
        [HttpPost]
        public IActionResult PostPackage([FromBody] TourPackage package)
        {
            TourPackage newPackage = new TourPackage();
            newPackage.PackageId = package.PackageId;
            newPackage.PackageAvailability = package.PackageAvailability;
            newPackage.StartDate = package.StartDate;
            newPackage.EndDate = package.EndDate;
            newPackage.PackageDescription = package.PackageDescription;
            newPackage.Accomodation = package.Accomodation;
            newPackage.Price = package.Price;
            newPackage.DestinationId = package.DestinationId;

            _db.Add(newPackage);
            _db.SaveChanges();
            return Ok(newPackage);

        }
        // editovanje paketa. samo admin ima tu mogucnost.
        [HttpPut("{id:int}")]
        public IActionResult UpdatePackage([FromBody] TourPackage data, int id)
        {
            var editPackage = _db.TourPackages.Find(id);
            if (data == null)
            {
                return BadRequest("Package not found!");
            }
            //editPackage.PackageId = data.PackageId;
            editPackage.PackageAvailability = data.PackageAvailability;
            editPackage.StartDate = data.StartDate;
            editPackage.EndDate = data.EndDate;
            editPackage.PackageDescription= data.PackageDescription;
            editPackage.Accomodation = data.Accomodation;
            editPackage.Price = data.Price;
            editPackage.DestinationId = data.DestinationId;

            _db.SaveChanges();
            return Ok("Package edited");
        }
        // Uklanjanje TOUR paketa, samo Admin ima dozvolu za uklanjanje.
        [HttpDelete("{id:int}")]
        public IActionResult DeletePackage( int id)
        {
            TourPackage packageData = _db.TourPackages.Where(a => a.PackageId == id).FirstOrDefault();
            if (packageData == null)
            {
                return NotFound("Package is not found in Database.");
            }

            _db.Remove(packageData);
            _db.SaveChanges();

            return Ok(packageData);

        }
    }
}
