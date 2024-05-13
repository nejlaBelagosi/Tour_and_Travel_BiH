using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DbTourAndTravelBiHContext _db;
        public UsersController(DbTourAndTravelBiHContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _db.Users.ToList();
            return Ok(users);
        }
    }
}
