using Server.Services;

namespace Server
{
    public abstract class ValidateAuth0UserFilterAttribute : BaseActionFilterAttribute
    {
        protected readonly IAuth0Service _auth0Service;

        public ValidateAuth0UserFilterAttribute(IMyCommunityContext dbContext, IAuth0Service auth0Service) : base(dbContext)
        {
            this._auth0Service = auth0Service;
        }
    }
}