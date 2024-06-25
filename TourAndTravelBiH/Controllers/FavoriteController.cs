using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly DbTourAndTravelBiHContext _db;
        public FavoriteController(DbTourAndTravelBiHContext db)
        {
            _db = db;
        }

        [HttpGet("{userId}")]
        public IActionResult GetFavoriteByUserId(int userId)
        {

            var favorite = _db.Favorites
                .Include(f => f.Package)
                .Where(f => f.UserId == userId)
                .Select(f => new
                {
                    f.FavoriteItemId,
                    f.PackageId,
                    f.UserId,
                    destinationName = f.Package.Destination.DestinationName,
                    destinationLocation = f.Package.Destination.DestinationLocation,
                    destinationDetails = f.Package.Destination.DestinationDetails,
                    destinationImage = f.Package.Destination.DestinationImage
                }).ToList();

            return Ok(favorite);
        }

        [HttpPost]
        public IActionResult PostFavorite([FromBody] Favorite favorite)
        {

            if (favorite.UserId == null || favorite.UserId == 0)
            {
                return BadRequest("User must be logged in to add favorites.");
            }

            Favorite newFavorite = new Favorite
            {
                PackageId = favorite.PackageId,
                UserId = favorite.UserId
            };

            _db.Add(newFavorite);
            _db.SaveChanges();
            return Ok(newFavorite);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteFavorite(int id)
        {
            Favorite favoriteData = _db.Favorites.FirstOrDefault(a => a.FavoriteItemId == id);
            if (favoriteData == null)
            {
                return NotFound("Favorite not found in Database.");
            }

            _db.Remove(favoriteData);
            _db.SaveChanges();

            return Ok(favoriteData);
        }
    }
}
