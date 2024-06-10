using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TourAndTravelBiH.Models;
using TourAndTravelBiH.Helper;

namespace TourAndTravelBiH.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DbTourAndTravelBiHContext _db = new DbTourAndTravelBiHContext();

        [HttpPost("login")]
        public IActionResult Obradi([FromBody] AuthLoginRequest request)
        {
            //1- provjera logina
            var logiraniKorisnik = _db.Accounts.Include(a => a.User).FirstOrDefault(k => k.Username == request.Username
            && k.UserPassword == request.UserPassword);

            if (logiraniKorisnik == null)
            {
                return BadRequest(new { code = "USER_NOT_FOUND", message = "Korisnik ne postoji molimo vas registrujte se." });
            }
            //2- generisati random string
            string randomString = TokenGenerator.Generate(10);

            //3- dodati novi zapis u tabelu AutentifikacijaToken za logiraniKorisnikId i randomString
            var noviToken = new AuthenticationToken()
            {
                TokenValue = randomString,
                Account = logiraniKorisnik,
                RecordingTime = DateTime.Now,
            };

            _db.Add(noviToken);
            _db.SaveChanges();

            //4- vratiti token string i korisničke podatke
            return Ok(new
            {
                token = randomString,
                user = new
                {
                    logiraniKorisnik.User.Name,
                    logiraniKorisnik.User.Surname,
                    logiraniKorisnik.AccountTypeId
                }
            });
        }

        [HttpPost("Adminlogin")]
        public IActionResult AdminLogin([FromBody] AuthLoginRequest request)
        {
            var logiraniKorisnik = _db.Accounts.Include(a => a.User)
                .FirstOrDefault(k => k.Username == request.Username && k.UserPassword == request.UserPassword);

            if (logiraniKorisnik == null)
            {
                var existingAccount = _db.Accounts.FirstOrDefault(a => a.Username == request.Username);
                if (existingAccount == null)
                {
                    return BadRequest(new { code = "USER_NOT_FOUND", message = "Korisnik ne postoji molimo vas registrujte se." });
                }
                return BadRequest(new { code = "INVALID_CREDENTIALS", message = "Neispravno korisničko ime ili lozinka." });
            }

            if (logiraniKorisnik.AccountTypeId == 1)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { code = "FORBIDDEN", message = "Nemate autorizovan pristup." });
            }

            string randomString = TokenGenerator.Generate(10);

            var noviToken = new AuthenticationToken()
            {
                TokenValue = randomString,
                AccountId = logiraniKorisnik.AccountId,
                RecordingTime = DateTime.Now,
            };

            _db.Add(noviToken);
            _db.SaveChanges();

            return Ok(new
            {
                token = randomString,
                tokenId = noviToken.AuthenticationId,
                user = new
                {
                    logiraniKorisnik.User.Name,
                    logiraniKorisnik.User.Surname,
                    logiraniKorisnik.AccountTypeId
                }
            });
        }



        [HttpDelete("logout/{id:int}")]
        public IActionResult DeleteToken(int id)
        {
            AuthenticationToken tokenData = _db.AuthenticationTokens.Where(a => a.AuthenticationId == id).FirstOrDefault();
            if (tokenData == null)
            {
                return NotFound("Token is not found in Database.");
            }

            _db.Remove(tokenData);
            _db.SaveChanges();

            return Ok(tokenData);
        }

        //[HttpPost("checkUser")]
        //public IActionResult CheckUser([FromBody] AuthLoginRequest request)
        //{
        //    var existingAccount = _db.Accounts.FirstOrDefault(a => a.Username == request.Username);
        //    if (existingAccount == null)
        //    {
        //        return NotFound("Account does not exist. Please create an account.");
        //    }

        //    return Ok("Account exists.");
        //}
    }

    public class AuthLoginRequest
    {
        public string Username { get; set; }
        public string UserPassword { get; set; }
    }
}
