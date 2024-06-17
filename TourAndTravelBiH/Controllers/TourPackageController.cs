using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TourAndTravelBiH.Helper;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TourPackageController : ControllerBase
    {
        private readonly MyAuthService _authService;
        private readonly DbTourAndTravelBiHContext _db;
        public TourPackageController(MyAuthService authService, DbTourAndTravelBiHContext db)
        {
            _authService = authService;
            _db = db;
        }

        // Fetch all packages with their dates and destination
        [HttpGet]
        public IActionResult GetPackage()
        {
            var packages = _db.TourPackages
                              .Include(p => p.Destination)
                              .Include(p => p.TourPackageDates)
                              .ToList();
            var result = packages.Select(p => new
            {
                p.PackageId,
                p.PackageAvailability,
                p.Accomodation,
                p.PackageDescription,
                p.Price,
                destinationName = p.Destination != null ? p.Destination.DestinationName : null,
                destinationImage = p.Destination.DestinationImage,
                destinationDetails = p.Destination.DestinationDetails,
                Dates = p.TourPackageDates.Select(d => new { d.DateId, d.StartDate, d.EndDate,
                })
            });
            return Ok(result);
        }

        // Fetch a package by ID with its dates and destination
        [HttpGet("{id:int}")]
        public IActionResult GetPackageId(int id)
        {
            var package = _db.TourPackages
                             .Include(p => p.Destination)
                             .Include(p => p.TourPackageDates)
                             .FirstOrDefault(p => p.PackageId == id);
            if (package == null)
            {
                return NotFound();
            }

            var result = new
            {
                package.PackageId,
                package.PackageAvailability,
                package.Accomodation,
                package.PackageDescription,
                package.Price,
                destinationName = package.Destination != null ? package.Destination.DestinationName : null,
                destinationImage = package.Destination.DestinationImage,
                destinationDetails = package.Destination.DestinationDetails,
                Dates = package.TourPackageDates.Select(d => new
                {
                    d.DateId,
                    d.StartDate,
                    d.EndDate,
     
                })
            };

            return Ok(result);
        }


        // Add a new package with dates
        [HttpPost]
        public IActionResult PostPackage([FromBody] PackageRequest packageRequest)
        {
            var newPackage = new TourPackage
            {
                PackageAvailability = packageRequest.PackageAvailability,
                PackageDescription = packageRequest.PackageDescription,
                Accomodation = packageRequest.Accomodation,
                Price = packageRequest.Price,
                DestinationId = packageRequest.DestinationId
            };

            _db.TourPackages.Add(newPackage);
            _db.SaveChanges();

            foreach (var date in packageRequest.Dates)
            {
                var tourPackageDate = new TourPackageDate
                {
                    PackageId = newPackage.PackageId,
                    StartDate = date.StartDate,
                    EndDate = date.EndDate
                };
                _db.TourPackageDates.Add(tourPackageDate);
            }
            _db.SaveChanges();

            return Ok(newPackage);
        }

        // Update an existing package with dates
        [HttpPut("{id:int}")]
        public IActionResult UpdatePackage([FromBody] TourPackage data, int id)
        {
            var editPackage = _db.TourPackages
                                 .Include(p => p.TourPackageDates)
                                 .FirstOrDefault(p => p.PackageId == id);
            if (editPackage == null)
            {
                return BadRequest("Package not found!");
            }

            // Update package details
            editPackage.PackageAvailability = data.PackageAvailability;
            editPackage.PackageDescription = data.PackageDescription;
            editPackage.Accomodation = data.Accomodation;
            editPackage.Price = data.Price;
            editPackage.DestinationId = data.DestinationId;

            // Remove existing dates
            _db.TourPackageDates.RemoveRange(editPackage.TourPackageDates);

            // Add new dates
            foreach (var date in data.TourPackageDates)
            {
                var tourPackageDate = new TourPackageDate
                {
                    PackageId = editPackage.PackageId,
                    StartDate = date.StartDate,
                    EndDate = date.EndDate
                };
                _db.TourPackageDates.Add(tourPackageDate);
            }

            _db.SaveChanges();
            return Ok(editPackage);
        }

        // Delete a package and its dates
        [HttpDelete("{id:int}")]
        public IActionResult DeletePackage(int id)
        {
            //if (_authService.AccountTypeId != 0)
            //    throw new UnauthorizedAccessException();

            var packageData = _db.TourPackages
                                 .Include(p => p.TourPackageDates)
                                 .FirstOrDefault(a => a.PackageId == id);
            if (packageData == null)
            {
                return NotFound("Package is not found in Database.");
            }

            _db.TourPackageDates.RemoveRange(packageData.TourPackageDates);
            _db.TourPackages.Remove(packageData);
            _db.SaveChanges();

            return Ok(packageData);
        }
    }

    public class PackageRequest
    {
        public bool PackageAvailability { get; set; }
        public string Accomodation { get; set; }
        public string PackageDescription { get; set; }
        public decimal Price { get; set; }
        public int DestinationId { get; set; }
        public List<TourPackageDateRequest> Dates { get; set; }
    }

    public class TourPackageDateRequest
    {
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
