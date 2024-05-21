using Microsoft.AspNetCore.Http;
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

        //dohvacanje slike
        [HttpGet("{imageName}")]
        public IActionResult GetImage(string imageName)
        {
            var imagePath = Path.Combine("C:\\Users\\BLGS HP\\Pictures\\SLIKE ZA PROJEKAT", imageName);

            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound();
            }

            var imageFileStream = System.IO.File.OpenRead(imagePath);
            return File(imageFileStream, "image/png"); // Promijenite tip MIME prema potrebi
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

            if(data.DestinationLocation != null && data.DestinationLocation != "string")
            {
                editDestination.DestinationLocation= data.DestinationLocation;
            }
            if (data.DestinationName != null && data.DestinationName != "string")
            {
                editDestination.DestinationName = data.DestinationName;
            }
            if (data.DestinationDetails != null && data.DestinationDetails != "string")
            {
            editDestination.DestinationDetails= data.DestinationDetails;
            }
            if (data.DestinationImage != null && data.DestinationImage != "string")
            {
           editDestination.DestinationImage= data.DestinationImage;
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
