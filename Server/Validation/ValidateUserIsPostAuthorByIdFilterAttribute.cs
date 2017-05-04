using Microsoft.AspNetCore.Mvc;
using Server.Services;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace Server
{
    public class ValidateUserIsPostAuthorByIdFilterAttribute : ValidateAuth0UserFilterAttribute
    {
        public ValidateUserIsPostAuthorByIdFilterAttribute(IMyCommunityContext dbContext, IAuth0Service auth0Service) : base(dbContext, auth0Service)
        {
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!context.ProcessInvalidModelState())
                return;

            var postId = (int)context.ActionArguments["postId"];
            var email = (await base._auth0Service.GetTokenInfo((IHeaderProvider)context.Controller)).Email;
            var post = await _dbContext.Posts.Include(x => x.Author).SingleOrDefaultAsync(x => x.Id == postId);
            if (post == null)
            {
                context.Result = new NotFoundResult();
                return;
            }
            if (post.Author?.Email != email)
            {
                context.Result = new UnauthorizedResult();
                return;
            }
            await base.OnActionExecutionAsync(context, next);
        }
    }
}