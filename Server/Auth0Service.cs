using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using RestSharp.Portable;
using RestSharp.Portable.HttpClient;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using Microsoft.Extensions.Primitives;

namespace Server.Services
{
    public class Auth0Service : IAuth0Service
    {
        public Auth0Service()
        {
        }

        public async Task<IAuth0UserProfile> GetTokenInfo(IHeaderProvider headerProvider)
        {
            var headers = headerProvider.Headers;
            var authorizationHeaderValues = headers["Authorization"];
            if (authorizationHeaderValues.Count == 0)
                return null;
            return await this.GetTokenInfo(headers["Authorization"][0].Remove(0, "Bearer ".Length));
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
