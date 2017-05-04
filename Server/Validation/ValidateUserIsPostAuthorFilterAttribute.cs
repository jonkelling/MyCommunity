using Microsoft.AspNetCore.Mvc;
using Server.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Server.Model;

namespace Server
{
    public class ValidateUserIsPostAuthorFilterAttribute : ValidateAuth0UserFilterAttribute
    {
        public ValidateUserIsPostAuthorFilterAttribute(IMyCommunityContext dbContext, IAuth0Service auth0Service) : base(dbContext, auth0Service)
        {
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!context.ProcessInvalidModelState())
                return;

            var postVm = (PostVm)context.ActionArguments["value"];
            var email = (await base._auth0Service.GetTokenInfo((IHeaderProvider)context.Controller)).Email;
            var user = await _dbContext.Users.SingleOrDefaultAsync(x => x.Email == email);
            if (user?.Id != postVm.Author.Id)
            {
                context.Result = new ForbidResult();
                return;
            }
            await base.OnActionExecutionAsync(context, next);
        }
    }
}