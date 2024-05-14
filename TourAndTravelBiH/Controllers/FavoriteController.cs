using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        // dohvacanje favorite, pregled user
        [HttpGet]
        public IActionResult GetFavorite()
        {
            var favorite = _db.Favorites.ToList();
            return Ok(favorite);
        }

        //dodavanje favorite, dodaju useri na user dijelu
       
        [HttpPost]
        public IActionResult PostFavorite([FromBody] Favorite favorite)
        {
            Favorite newFavorite = new Favorite();
            newFavorite.FavoriteItemId = favorite.FavoriteItemId;
            newFavorite.PackageId = favorite.PackageId;
            newFavorite.UserId = favorite.UserId;

            _db.Add(newFavorite);
            _db.SaveChanges();
            return Ok(newFavorite);

        }

        //Brisanje favorite sa stranice. User
        [HttpDelete("{id:int}")]
        public IActionResult DeleteFavorite( int id)
        {
            Favorite favoriteData = _db.Favorites.Where(a => a.FavoriteItemId == id).FirstOrDefault();
            if (favoriteData == null)
            {
                return NotFound("Favorite is not found in Database.");
            }

            _db.Remove(favoriteData);
            _db.SaveChanges();

            return Ok(favoriteData);

        }
    }
}
