using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using RestSharp.Portable;
using RestSharp.Portable.HttpClient;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using Microsoft.Extensions.Primitives;
using Microsoft.Extensions.Caching.Memory;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Server.Services
{
    public class Auth0Service : IAuth0Service
    {
        private readonly IMemoryCache _cache;

        public Auth0Service(IMemoryCache memoryCache)
        {
            this._cache = memoryCache;
        }

        public async Task<IAuth0UserProfile> GetTokenInfo(IHeaderProvider headerProvider)
        {
            return await this.GetTokenInfo(GetIdToken(headerProvider));
        }

        public async Task<IAuth0UserProfile> GetTokenInfo(string idToken)
        {
            return await _cache.GetOrCreateAsync(idToken, async entry =>
            {
                entry.AbsoluteExpiration = new JwtSecurityToken(idToken).ValidTo;
                entry.SlidingExpiration = TimeSpan.FromSeconds(10);
                using (var client = new RestClient("https://mycommunity.auth0.com/tokeninfo"))
                {
                    var request = new RestRequest(Method.POST);
                    request.AddHeader("content-type", "application/x-www-form-urlencoded");
                    request.AddHeader("cache-control", "no-cache");
                    request.AddParameter("id_token", idToken, ParameterType.GetOrPost);
                    var response = await client.Execute<Auth0UserProfile>(request);
                    return response.Data;
                }
            });
        }

        private string GetIdToken(IHeaderProvider headerProvider)
        {
            var headers = headerProvider.Headers;
            var authorizationHeaderValues = headers["Authorization"];
            if (authorizationHeaderValues.Count == 0)
                return null;
            return headers["Authorization"][0].Remove(0, "Bearer ".Length);
        }
    }
}
