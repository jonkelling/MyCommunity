using System.Threading.Tasks;
using RestSharp.Portable;
using RestSharp.Portable.HttpClient;

namespace Server
{
    public class Auth0Service
    {
        public async Task<Auth0UserProfile> GetTokenInfo(string idToken)
        {
            using (var client = new RestClient("https://mycommunity.auth0.com/tokeninfo"))
            {
                var request = new RestRequest(Method.POST);
                request.AddHeader("content-type", "application/x-www-form-urlencoded");
                request.AddHeader("cache-control", "no-cache");
                request.AddParameter("id_token", idToken, ParameterType.GetOrPost);
                var response = await client.Execute<Auth0UserProfile>(request);
                return response.Data;
            }
        }
    }
}
