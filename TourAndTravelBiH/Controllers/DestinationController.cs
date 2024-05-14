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
        //dodavanje destinacija u BP. Admin samo moze.
        [HttpPost]
        public IActionResult PostDestination([FromBody] Destination destination)
        {
            Destination newDestination = new Destination();
            newDestination.DestinationId = destination.DestinationId;
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
            if (data == null)
            {
                return BadRequest("Destination not found!");
            }
           
            editDestination.DestinationLocation = data.DestinationLocation;
            editDestination.DestinationName= data.DestinationName;
            editDestination.DestinationDetails= data.DestinationDetails;
            editDestination.DestinationImage= data.DestinationImage;

            _db.SaveChanges();
            return Ok("Destination edited");
        }
        //Brisanje destinacija. Admin samo moze.
        [HttpDelete("{id:int}")]
        public IActionResult DeleteDestination([FromBody] int id)
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
