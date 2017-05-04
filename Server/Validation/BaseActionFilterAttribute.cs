using Microsoft.AspNetCore.Mvc.Filters;

namespace Server
{
    public abstract class BaseActionFilterAttribute : ActionFilterAttribute
    {
        protected readonly IMyCommunityContext _dbContext;

        public BaseActionFilterAttribute(IMyCommunityContext dbContext)
        {
            this._dbContext = dbContext;
        }
    }
}