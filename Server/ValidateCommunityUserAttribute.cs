using Microsoft.AspNetCore.Mvc;
using Server.Services;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Server.Model;

namespace Server
{
    public abstract class ValidateAuth0UserFilterAttribute : ActionFilterAttribute
    {
        protected readonly IMyCommunityContext _dbContext;
        protected readonly IAuth0Service _auth0Service;

        public ValidateAuth0UserFilterAttribute(IMyCommunityContext dbContext, IAuth0Service auth0Service)
        {
            this._dbContext = dbContext;
            this._auth0Service = auth0Service;
        }
    }

    public class ValidateCommunityUserFilterAttribute : ValidateAuth0UserFilterAttribute
    {
        public ValidateCommunityUserFilterAttribute(IMyCommunityContext dbContext, IAuth0Service auth0Service) : base(dbContext, auth0Service)
        {
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var communityId = (int)context.ActionArguments["communityId"];
            var email = (await base._auth0Service.GetTokenInfo((IHeaderProvider)context.Controller)).Email;
            var user = await _dbContext.Users.SingleOrDefaultAsync(x => x.Email == email);
            if (user?.CommunityId != communityId)
            {
                context.Result = new UnauthorizedResult();
                return;
            }
            await base.OnActionExecutionAsync(context, next);
        }
    }

    public class ValidateUserIsPostAuthorFilterAttribute : ValidateAuth0UserFilterAttribute
    {
        public ValidateUserIsPostAuthorFilterAttribute(IMyCommunityContext dbContext, IAuth0Service auth0Service) : base(dbContext, auth0Service)
        {
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var postVm = (PostVm)context.ActionArguments["value"];
            var email = (await base._auth0Service.GetTokenInfo((IHeaderProvider)context.Controller)).Email;
            var user = await _dbContext.Users.SingleOrDefaultAsync(x => x.Email == email);
            if (user?.Id != postVm.Author.Id)
            {
                context.Result = new UnauthorizedResult();
                return;
            }
            await base.OnActionExecutionAsync(context, next);
        }
    }

    public class ValidateUserIsPostAuthorByIdFilterAttribute : ValidateAuth0UserFilterAttribute
    {
        public ValidateUserIsPostAuthorByIdFilterAttribute(IMyCommunityContext dbContext, IAuth0Service auth0Service) : base(dbContext, auth0Service)
        {
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var postId = (int)context.ActionArguments["id"];
            var email = (await base._auth0Service.GetTokenInfo((IHeaderProvider)context.Controller)).Email;
            var user = _dbContext.Users.SingleOrDefaultAsync(x => x.Email == email);
            var post = _dbContext.Posts.SingleOrDefaultAsync(x => x.Id == postId);
            if ((await user)?.Id != (await post)?.Author.Id)
            {
                context.Result = new UnauthorizedResult();
                return;
            }
            await base.OnActionExecutionAsync(context, next);
        }
    }
}