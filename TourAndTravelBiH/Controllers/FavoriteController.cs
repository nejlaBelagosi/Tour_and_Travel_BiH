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

        [HttpGet]
        public IActionResult GetFavorite()
        {
            var favorite = _db.Favorites
                .Include (f => f.Package)// Assuming `Package` is the navigation property for the related data
                .Select(f => new
                {
                    f.FavoriteItemId,
                    f.PackageId,
                    f.UserId,
                    DestinationName = f.Package.Destination.DestinationName,
                    DestinationLocation = f.Package.Destination.DestinationLocation,
                    DestinationDetails = f.Package.Destination.DestinationDetails,
                    DestinationImage = f.Package.Destination.DestinationImage
                }).ToList();

            return Ok(favorite);
        }

        [HttpPost]
        public IActionResult PostFavorite([FromBody] Favorite favorite)
        {
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
