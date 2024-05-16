using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TourAndTravelBiH.Helper;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TourPackageController : ControllerBase
    {
        private readonly MyAuthService _authService;
        DbTourAndTravelBiHContext _db = new DbTourAndTravelBiHContext();
        public TourPackageController( MyAuthService authService)
        {
           
            _authService = authService;

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
            // provjera da li paket vec postoji
            var existingPackage = _db.TourPackages.FirstOrDefault(a => a.PackageId == package.PackageId);
            if (existingPackage != null)
            {
                return BadRequest("Paket već postoji.");
            }
            TourPackage newPackage = new TourPackage();
           // newPackage.PackageId = package.PackageId; => id se automatski generise
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
            if (editPackage == null)
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
        public IActionResult DeletePackage([FromRoute] int id)
        {

            if (_authService.AccountTypeId != 0)
                throw new UnauthorizedAccessException();

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
