using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.ML;
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
        [HttpGet("Accounts")]
        public async Task<IActionResult> GetAccountsCount()
        {
            var count = await _db.Accounts.CountAsync();
            return Ok(count);
        }
        // dohvacanje account-a
        [HttpGet]
        public IActionResult GetAccount()
        {
            var account = _db.Accounts.Include(p => p.User).ToList();
            var result = account.Select(p => new
            {
                p.AccountId,
                p.AccountTypeId,
                p.AccountType,
                userName = p.User.Name,
                userSurname = p.User.Surname,
    
            });
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetAccountById(int id)
        {
            var account = _db.Accounts.Include(p => p.User)
                                      .FirstOrDefault(a => a.AccountId == id);

            if (account == null)
            {
                return NotFound(new { message = "Account not found." });
            }

            var result = new
            {
                account.AccountId,
                account.AccountTypeId,
                account.AccountType,
                userName = account.User.Name,
                userSurname = account.User.Surname,
                account.Username,
                account.UserPassword
            };

            return Ok(result);
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
        // uredjivanje sifre
        [HttpPut("UpdatePassword/{id:int}")]
        public IActionResult UpdatePassword(int id, [FromBody] PasswordUpdateDto dto)
        {
            var account = _db.Accounts.Include(a => a.User).FirstOrDefault(a => a.AccountId == id);
            if (account == null)
            {
                return NotFound(new { message = "Account not found." });
            }

            if (account.UserPassword != dto.CurrentPassword)
            {
                return BadRequest(new { message = "Current password is incorrect." });
            }

            if (!IsValidPassword(dto.NewPassword))
            {
                return BadRequest(new { message = "New password does not meet complexity requirements." });
            }

            account.UserPassword = dto.NewPassword;
            _db.SaveChanges();
            return Ok(account);
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
    private bool IsValidPassword(string password)
    {
        if (password.Length < 8) return false;
        if (!password.Any(char.IsDigit)) return false;
        if (!password.Any(ch => "!@#$%^&*(),.?\":{}|<>".Contains(ch))) return false;
        return true;
    }

    }

    public class PasswordUpdateDto
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}