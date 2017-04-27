using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using RestSharp.Portable;
using RestSharp.Portable.HttpClient;
using Microsoft.Extensions.DependencyInjection;

namespace Server.Services
{
    public class Auth0Service : IAuth0Service
    {
        public Auth0Service()
        {
        }

        public Task<IAuth0UserProfile> GetTokenInfo(IRequestProvider requestProvider)
        {
            var request = requestProvider.Request;
            var authorizationHeaderValues = request.Headers["Authorization"];
            if (authorizationHeaderValues.Count == 0)
                return null;
            return this.GetTokenInfo(request.Headers["Authorization"][0].Remove(0, "Bearer ".Length));
        }

        public async Task<IAuth0UserProfile> GetTokenInfo(string idToken)
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
