﻿using Microsoft.AspNetCore.Http;
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
                p.AdditionalInformations,
                p.TourHighlights,
                destinationName = p.Destination != null ? p.Destination.DestinationName : null,
                destinationImage = p.Destination.DestinationImage,
                destinationDetails = p.Destination.DestinationDetails,
                Dates = p.TourPackageDates.Select(d => new { d.DateId, d.StartDate, d.EndDate,
                })
            });
            return Ok(result);
        }

        [HttpGet("Search")]
        public IActionResult SearchPackages([FromQuery] string destinationName, [FromQuery] DateTime? date)
        {
            var packages = _db.TourPackages
                              .Include(p => p.Destination)
                              .Include(p => p.TourPackageDates)
                              .AsQueryable();

            if (!string.IsNullOrEmpty(destinationName))
            {
                packages = packages.Where(p => p.Destination.DestinationName.Contains(destinationName));
            }

            if (date.HasValue)
            {
                var dateOnly = DateOnly.FromDateTime(date.Value);
                packages = packages.Where(p => p.TourPackageDates.Any(d => d.StartDate <= dateOnly && d.EndDate >= dateOnly));
            }

            var result = packages.ToList().Select(p => new
            {
                p.PackageId,
                p.PackageAvailability,
                p.Accomodation,
                p.PackageDescription,
                p.Price,
                destinationName = p.Destination != null ? p.Destination.DestinationName : null,
                Dates = p.TourPackageDates.Select(d => new { d.DateId, d.StartDate, d.EndDate })
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
                package.AdditionalInformations,
                package.TourHighlights,
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
                AdditionalInformations = packageRequest.AdditionalInformations,
                TourHighlights = packageRequest.TourHighlights,
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
        public IActionResult UpdatePackage(int id, [FromBody] PackageRequest data)
        {
            var existingPackage = _db.TourPackages
                                     .Include(p => p.TourPackageDates)
                                     .FirstOrDefault(p => p.PackageId == id);
            if (existingPackage == null)
            {
                return BadRequest("Package not found!");
            }

            // Update package details
            if (data.PackageDescription != null)
            {
                existingPackage.PackageAvailability = data.PackageAvailability;
            }
            if (data.PackageDescription != null && data.PackageDescription != "string")
            {
               existingPackage.PackageDescription = data.PackageDescription; 
            }
            if (data.Accomodation != null && data.Accomodation != "string")
            {
                existingPackage.Accomodation = data.Accomodation;
            }
            if (data.Price != null && data.Price != default(decimal))
            {
                 existingPackage.Price = data.Price;
            }

            if (data.DestinationId != null && data.DestinationId != default(int))
            {
               existingPackage.DestinationId = data.DestinationId; 
            }
            if (data.AdditionalInformations != null && data.AdditionalInformations != "string")
            {
              existingPackage.AdditionalInformations = data.AdditionalInformations;
            }
            if (data.TourHighlights != null && data.TourHighlights != "string")
            {
                   existingPackage.TourHighlights = data.TourHighlights;
            }
         

            // Remove dates that are not in the updated list
            var datesToRemove = existingPackage.TourPackageDates
                                               .Where(d => !data.Dates.Any(nd => nd.DateId == d.DateId))
                                               .ToList();
            _db.TourPackageDates.RemoveRange(datesToRemove);

            // Update or add new dates
            foreach (var date in data.Dates)
            {
                var existingDate = existingPackage.TourPackageDates.FirstOrDefault(d => d.DateId == date.DateId);
                if (existingDate != null)
                {
                    existingDate.StartDate = date.StartDate;
                    existingDate.EndDate = date.EndDate;
                }
                else
                {
                    var newDate = new TourPackageDate
                    {
                        PackageId = existingPackage.PackageId,
                        StartDate = date.StartDate,
                        EndDate = date.EndDate
                    };
                    _db.TourPackageDates.Add(newDate);
                }
            }

            _db.SaveChanges();
            return Ok(existingPackage);
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
        public string AdditionalInformations { get; set; }
        public string TourHighlights { get; set; }
        public List<TourPackageDateRequest> Dates { get; set; }
    }

    public class TourPackageDateRequest
    {
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public int DateId { get; set; }
    }
}
