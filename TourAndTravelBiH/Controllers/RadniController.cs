using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TourAndTravelBiH.Models;
using TourAndTravelBiH.Helper;

namespace TourAndTravelBiH.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RadniController : ControllerBase
    {
        private readonly MyAuthService _authService;
        DbTourAndTravelBiHContext _db = new DbTourAndTravelBiHContext();

        public RadniController(MyAuthService authService)
        {
            _authService = authService;
        }

        //AUTORIZACIJA ZA TOUR_PACKAGE TABELE

        [HttpGet]
        public IActionResult prikazi_sve_Pakete() //za select svega
        {
            if (_authService.AccountTypeId != 0 && _authService.AccountTypeId != 1 )
                throw new UnauthorizedAccessException();

            List<TourPackage> package = _db.TourPackages.OrderByDescending(r => r.PackageId).ToList();
            return Ok(package);
        }
       [HttpDelete("{parametar:int}")]
        public IActionResult Delete(int parametar)  //za brisanje po ID
        {
            if (_authService.AccountTypeId != 0)
                throw new UnauthorizedAccessException();

            TourPackage rezultat = _db.TourPackages.Where(r => r.PackageId == parametar).FirstOrDefault();
            //select * from  where....
            if (rezultat == null)
            { return NotFound($"Podatak sa Id = {parametar} nije pronadjen"); }
            else
            {
                _db.Remove(rezultat);
                _db.SaveChanges();
            }
            return Ok(parametar);
        }
    }
}
