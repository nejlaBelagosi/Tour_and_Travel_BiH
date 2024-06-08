using Microsoft.AspNetCore.Http;
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

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _db.Users.ToList();
            return Ok(users);
        }

        [HttpPost]
        public IActionResult PostUser([FromBody] User data)
        {
            _db.Users.Add(new User
            {
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

        [HttpPut("{id:int}")]
        public IActionResult UpdateUser([FromBody] User data, int id)
        {
            var editUser = _db.Users.Find(id);
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

            if (data.DateOfBirth != null && data.DateOfBirth != default(DateTime))
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

        //[HttpDelete("{id:int}")]
        //public IActionResult DeleteUser([FromRoute] int id)
        //{
        //    User userData = _db.Users.Where(a => a.UserId == id).FirstOrDefault();
        //    if (userData == null)
        //    {
        //        return NotFound("User is not found in Database.");
        //    }

        //    _db.Remove(userData);
        //    _db.SaveChanges();

        //    return Ok(userData);
        //}
        [HttpDelete("{id:int}")]
        public IActionResult DeleteUser(int id)
        {
            var userData = _db.Users.Include(u => u.Accounts).FirstOrDefault(a => a.UserId == id);
            if (userData == null)
            {
                return NotFound("User is not found in Database.");
            }

            // Brisanje povezanih računa
            foreach (var account in userData.Accounts)
            {
                _db.Accounts.Remove(account);
            }

            // Brisanje korisnika
            _db.Users.Remove(userData);
            _db.SaveChanges();

            return Ok(userData);
        }


        [HttpPost]
        public IActionResult RegisterUser([FromBody] RegistrationDto registration)
        {
            // Provjera postojanja korisničkog računa po emailu
            var existingUser = _db.Users.FirstOrDefault(u => u.Email == registration.Email);
            if (existingUser != null)
            {
                return BadRequest("Korisnički račun već postoji.");
            }

            // Provjera postojanja korisničkog imena
            var existingAccount = _db.Accounts.FirstOrDefault(a => a.Username == registration.Username);
            if (existingAccount != null)
            {
                return BadRequest("Korisničko ime je već zauzeto.");
            }

            using var transaction = _db.Database.BeginTransaction();
            try
            {
                var newUser = new User
                {
                    Name = registration.Name,
                    Surname = registration.Surname,
                    Address = registration.Address,
                    DateOfBirth = registration.DateOfBirth,
                    Contact = registration.Contact,
                    Email = registration.Email
                };

                _db.Users.Add(newUser);
                _db.SaveChanges();

                var newAccount = new Account
                {
                    AccountTypeId = registration.AccountTypeId,
                    UserId = newUser.UserId,
                    Username = registration.Username,
                    UserPassword = registration.UserPassword,
                    UserImage = registration.UserImage
                };

                _db.Accounts.Add(newAccount);
                _db.SaveChanges();

                transaction.Commit();
                return Ok(new { newUser, newAccount });
            }
            catch (Exception)
            {
                transaction.Rollback();
                return StatusCode(StatusCodes.Status500InternalServerError, "Error while creating user and account");
            }
        }
    }

    public class RegistrationDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Address { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public int AccountTypeId { get; set; }
        public string Username { get; set; }
        public string UserPassword { get; set; }
        public string UserImage { get; set; }
    }
}