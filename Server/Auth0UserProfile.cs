using System;
using Newtonsoft.Json;

namespace Server
{
    public class Auth0UserProfile : IAuth0UserProfile
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
}
