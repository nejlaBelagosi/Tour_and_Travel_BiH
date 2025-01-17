﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DestinationController : ControllerBase
    {
        private readonly DbTourAndTravelBiHContext _db;
        public DestinationController(DbTourAndTravelBiHContext db)
        {
            _db = db;
        }
        // dohvacanje svih destinacija iz BP.
        [HttpGet]
        public IActionResult GetDestination()
        {

            var destination = _db.Destinations.ToList();
            return Ok(destination);
        }

        //dohvacanje danasnjeg prijedloga destinacija
        [HttpGet]
        public IActionResult GetRecommendedDestinations()
        {
            var destinations = _db.Destinations.ToList();
            var random = new Random();
            var randomDestinations = destinations.OrderBy(d => random.Next()).Take(2).ToList();

            return Ok(randomDestinations);
        }

        [HttpGet]
        public IActionResult GetPopularDestinations()
        {
            var destinations = _db.Destinations.ToList();
            var random = new Random();
            var randomDestinations = destinations.OrderBy(d => random.Next()).Take(5).ToList();

            return Ok(randomDestinations);
        }

        //dohvacanje slike
        //[HttpGet("{imageName}")]
        //public IActionResult GetImage(string imageName)
        //{
        //    var imagePath = Path.Combine("C:\\Users\\BLGS HP\\Pictures\\SLIKE ZA PROJEKAT", imageName);

        //    if (!System.IO.File.Exists(imagePath))
        //    {
        //        return NotFound();
        //    }

        //    var imageFileStream = System.IO.File.OpenRead(imagePath);
        //    return File(imageFileStream, "image/png");
        //}
        [HttpGet("{imageName}")]
        public IActionResult GetImage(string imageName)
        {
            var imagePath = Path.Combine("C:\\Users\\BLGS HP\\Pictures\\SLIKE ZA PROJEKAT", imageName);

            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound();
            }

            var mimeTypes = new Dictionary<string, string>
    {
        { ".png", "image/png" },
        { ".jpg", "image/jpeg" },
        { ".jpeg", "image/jpeg" }
    };

            var fileExtension = Path.GetExtension(imagePath).ToLowerInvariant();

            if (!mimeTypes.ContainsKey(fileExtension))
            {
                return BadRequest("Unsupported image format.");
            }

            var imageFileStream = System.IO.File.OpenRead(imagePath);
            return File(imageFileStream, mimeTypes[fileExtension]);
        }


        //dodavanje destinacija u BP. Admin samo moze.
        [HttpPost]
        public IActionResult PostDestination([FromBody] Destination destination)
        {
            // provjera da li destinacija vec postoji
            var existingDestination = _db.Destinations.FirstOrDefault(a => a.DestinationName == destination.DestinationName);
            if (existingDestination != null)
            {
                return BadRequest("Destinacija već postoji.");
            }
            Destination newDestination = new Destination();
            // newDestination.DestinationId = destination.DestinationId; => Id se generise automatski
            newDestination.DestinationLocation = destination.DestinationLocation;
            newDestination.DestinationName = destination.DestinationName;
            newDestination.DestinationDetails = destination.DestinationDetails;
            newDestination.DestinationImage = destination.DestinationImage;

            _db.Add(newDestination);
            _db.SaveChanges();
            return Ok(newDestination);

        }
        //Uredjivanje destinacija. Admin samo moze.
        [HttpPut("{id:int}")]
        public IActionResult UpdateDestination([FromBody] Destination data, int id)
        {
            var editDestination = _db.Destinations.Find(id);
            if (editDestination == null)
            {
                return BadRequest("Destination not found!");
            }

            if (data.DestinationLocation != null && data.DestinationLocation != "string")
            {
                editDestination.DestinationLocation = data.DestinationLocation;
            }
            if (data.DestinationName != null && data.DestinationName != "string")
            {
                editDestination.DestinationName = data.DestinationName;
            }
            if (data.DestinationImage != null && data.DestinationImage != "string")
            {
                editDestination.DestinationImage = data.DestinationImage;
            }
            if (data.DestinationDetails != null && data.DestinationDetails != "string")
            {
                editDestination.DestinationDetails = data.DestinationDetails;
            }


            _db.SaveChanges();
            return Ok(editDestination);
        }
        //Brisanje destinacija. Admin samo moze.
        [HttpDelete("{id:int}")]
        public IActionResult DeleteDestination([FromRoute] int id)
        {
            Destination destinationData = _db.Destinations.Where(a => a.DestinationId == id).FirstOrDefault();
            if (destinationData == null)
            {
                return NotFound("Destination is not found in Database.");
            }

            _db.Remove(destinationData);
            _db.SaveChanges();

            return Ok(destinationData);

        }
    }
}