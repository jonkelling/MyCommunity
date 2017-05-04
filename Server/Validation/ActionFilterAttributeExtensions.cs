using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Server
{
    public static class ActionFilterAttributeExtensions
    {
        public static bool ProcessInvalidModelState(this ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
                context.Result = new BadRequestResult();
            return context.ModelState.IsValid;
        }
    }
}