using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Server.Services
{
    public interface IAuth0Service
    {
        Task<IAuth0UserProfile> GetTokenInfo(IRequestProvider requestProvider);
        Task<IAuth0UserProfile> GetTokenInfo(string idToken);
    }
}
