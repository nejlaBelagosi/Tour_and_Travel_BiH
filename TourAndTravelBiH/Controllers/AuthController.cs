using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using TourAndTravelBiH.Models;

namespace TourAndTravelBiH.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DbTourAndTravelContext _applicationDbContext = new DbTourAndTravelContext();
    }
}
