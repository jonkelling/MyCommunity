using System;
using Newtonsoft.Json;

namespace Server
{
    public interface IAuth0UserProfile
    {
        string Name { get; set; }
        string Nickname { get; set; }
        Uri Picture { get; set; }
        [JsonProperty("user_id")]
        string UserId { get; set; }
        string Email { get; set; }
        [JsonProperty("email_verified")]
        bool EmailVerified { get; set; }
        [JsonProperty("given_name")]
        string GivenName { get; set; }
        [JsonProperty("family_name")]
        string FamilyName { get; set; }
    }
}
