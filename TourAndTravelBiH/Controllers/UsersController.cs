using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        // dohvacanje svih korisnika koji se nalaze u Bazi podataka
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _db.Users.ToList();
            return Ok(users);
        }

        // dodavanje korisnika od strane Admina. Ali ovaj post ce se modifikovati tako da se dodaju registrovani korisnici.
        [HttpPost]
        public IActionResult PostUser([FromBody] User data)
        {
            _db.Users.Add(new User
            {
               // UserId = data.UserId, => id se automatski generise
                Name = data.Name,
                Surname = data.Surname,
                Address = data.Address,
                DateOfBirth = data.DateOfBirth,
                Contact = data.Contact,
                Email = data.Email
            });

            _db.SaveChanges();
            return Ok(data);
        }
        // Uredjivanje korisnika. Ako vec postoje podaci za odredjeni Id u BP, a zelimo izmijeniti jedan podatak, taj podatak ce se 
        // zamijeniti, a ostali podaci koji se vec nalaze u BP ce se zadrzati.
        [HttpPut("{id:int}")]
        public IActionResult UpdateUser([FromBody] User data, int id)
        {
            var editUser = _db.Users.Find(id);
            // provjera da li korisnik postoji
            if (editUser == null)
            {
                return BadRequest("User not found!");
            }
            if (data.Name != null && data.Name != "string")
            {
                editUser.Name = data.Name;
            }

            if (data.Surname != null && data.Surname != "string")
            {
                editUser.Surname = data.Surname;
            }

            if (data.Address != null && data.Address != "string")
            {
                editUser.Address = data.Address;
            }

            // Provera da li je dat datum => PROVJERITI tj promijeniti datatype
            if (data.DateOfBirth != null && data.DateOfBirth != "string")
            {
                editUser.DateOfBirth = data.DateOfBirth;
            }

            if (data.Contact != null && data.Contact != "string")
            {
                editUser.Contact = data.Contact;
            }

            if (data.Email != null && data.Email != "string")
            {
                editUser.Email = data.Email;
            }

            _db.SaveChanges();
            return Ok(editUser);
        }

        // brisanje korisnika. Admin uloga. ali i korisnik ce moci da izbrise svoj nalog.
        [HttpDelete("{id:int}")]
        public IActionResult DeleteUser([FromRoute] int id)
        {
            User userData = _db.Users.Where(a => a.UserId == id).FirstOrDefault();
            if(userData == null)
            {
                return NotFound("User is not found in Database.");
            }

            _db.Remove(userData);
            _db.SaveChanges();

            return Ok(userData);

        }
    }
}

