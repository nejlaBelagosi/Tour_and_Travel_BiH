using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.HttpResults;
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
        public MyAuthInfo Obradi([FromBody] AuthLoginRequest request)
        {
            //1- provjera logina
            var logiraniKorisnik = _db.Accounts.FirstOrDefault(k => k.Username == request.Username
            && k.UserPassword == request.UserPassword);

            if (logiraniKorisnik == null)
            {
                //pogresan username i password
                return new MyAuthInfo(null);
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


            //4- vratiti token string
            return new MyAuthInfo(noviToken);

        }
        [HttpDelete("{id:int}")]
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
    }
    public class AuthLoginRequest
        {
            public string Username { get; set; }
            public string UserPassword { get; set; }
        }
    }

