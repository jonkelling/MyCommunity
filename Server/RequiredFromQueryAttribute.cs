using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Newtonsoft.Json;
using RestSharp.Portable;
using RestSharp.Portable.HttpClient;

namespace Server
{
    public class RequiredFromQueryAttribute : FromQueryAttribute, IParameterModelConvention
    {
        public void Apply(ParameterModel parameter)
        {
            if (parameter.Action.Selectors != null && parameter.Action.Selectors.Any())
            {
                var requiredFromQueryActionConstraint = new RequiredFromQueryActionConstraint(
                    parameter.BindingInfo?.BinderModelName ?? parameter.ParameterName
                );
                parameter.Action.Selectors.Last().ActionConstraints.Add(
                    requiredFromQueryActionConstraint
                );
            }
        }
    }

    public class Auth0UserProfile
    {
        public string Name { get; set; }
        public string Nickname { get; set; }
        public Uri Picture { get; set; }
        [JsonProperty("user_id")]
        public string UserId { get; set; }
        public string Email { get; set; }
        [JsonProperty("email_verified")]
        public bool EmailVerified { get; set; }
        [JsonProperty("given_name")]
        public string GivenName { get; set; }
        [JsonProperty("family_name")]
        public string FamilyName { get; set; }
    }

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
