using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DbTourAndTravelBiHContext _db;
        public AccountController(DbTourAndTravelBiHContext db)
        {

            _db = db;
        }
        // dohvacanje account-a
        [HttpGet]
        public IActionResult GetAccount()
        {
            var account = _db.Accounts.ToList();
            return Ok(account);
        }

        //dodavanje racuna, ali modifikovati da se doda prilikom registracije
        [HttpPost]
        public IActionResult PostAccount([FromBody] Account account)
        {
            // Provjera postojanja korisničkog imena
            var existingAccount = _db.Accounts.FirstOrDefault(a => a.Username == account.Username);
            if (existingAccount != null)
            {
                return BadRequest("Korisničko ime već postoji.");
            }

            Account newAccount= new Account();
            //newAccount.AccountId = account.AccountId;
            newAccount.AccountTypeId = account.AccountTypeId;
            newAccount.UserId = account.UserId;
            newAccount.Username = account.Username;
            newAccount.UserPassword = account.UserPassword;
            newAccount.UserImage = account.UserImage;

            _db.Add(newAccount);
            _db.SaveChanges();
            return Ok(newAccount);

        }
        //Uredjivanje accounta. Admin i user moze.
        [HttpPut("{id:int}")]
        public IActionResult UpdateAccount([FromBody] Account data, int id)
        {
            var editAccount = _db.Accounts.Find(id);
            if (editAccount == null)
            {
                return BadRequest("Account not found!");
            }

            editAccount.AccountTypeId = data.AccountTypeId;
            editAccount.Username = data.Username;
            editAccount.UserPassword = data.UserPassword;
            editAccount.UserImage = data.UserImage;
            editAccount.UserId = data.UserId;

            _db.SaveChanges();
            return Ok("Account edited");
        }
        //Brisanje accounta. Admin i user moze.
        [HttpDelete("{id:int}")]
        public IActionResult DeleteAccount( int id)
        {
            Account accountData = _db.Accounts.Where(a => a.AccountId == id).FirstOrDefault();
            if (accountData == null)
            {
                return NotFound("Account is not found in Database.");
            }

            _db.Remove(accountData);
            _db.SaveChanges();

            return Ok(accountData);

        }
    }
}
