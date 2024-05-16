using Microsoft.EntityFrameworkCore;
using TourAndTravelBiH.Models;
using TourAndTravelBiH.Helper;

namespace TourAndTravelBiH.Helper
{
    public class MyAuthService
    {
        private readonly DbTourAndTravelBiHContext _applicationDbContext = new DbTourAndTravelBiHContext();
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MyAuthService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public bool IsLogiran=> GetAuthInfo().isLogiran;
        public int? AccountTypeId => GetAuthInfo().AccountTypeId;
        
        public MyAuthInfo GetAuthInfo()
        {
            string? authToken = _httpContextAccessor.HttpContext!.Request.Headers["my-auth-token"];

            AuthenticationToken? autentifikacijaToken = _applicationDbContext.AuthenticationTokens
                .Include(x=>x.Account)
                .SingleOrDefault(x => x.TokenValue == authToken);

            return new MyAuthInfo(autentifikacijaToken);
        }
    }

    public class MyAuthInfo
    {
        public MyAuthInfo(AuthenticationToken? autentifikacijaToken)
        {
            this.AccountId = autentifikacijaToken?.Account?.AccountId;
            this.Username = autentifikacijaToken?.Account?.Username;
            this.UserImage = autentifikacijaToken?.Account?.UserImage;
            this.AccountTypeId = autentifikacijaToken?.Account?.AccountTypeId;
            this.TokenValue = autentifikacijaToken?.TokenValue;
        }

        public int? AccountId { get; set; }

        public string? Username{ get; set; }

        public string? UserImage { get; set; }

        public int? AccountTypeId { get; set; }

        public string? TokenValue { get; set; }
       
        public bool isLogiran => AccountId != null;

    }
}
