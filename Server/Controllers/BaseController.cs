using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using Server.Core;
using Server.Services;

namespace Server.Controllers
{
    public abstract class BaseController : Controller, IHeaderProvider
    {
        protected readonly IMyCommunityContext _dbContext;
        protected readonly IMapper _mapper;
        protected readonly IAuth0Service _auth0Service;
        protected readonly Lazy<Task<IAuth0UserProfile>> UserProfile;
        protected readonly Lazy<Task<User>> AuthenticatedUser;

        public BaseController(IMyCommunityContext dbContext, IMapper mapper, IAuth0Service auth0Service)
        {
            this._dbContext = dbContext;
            this._mapper = mapper;
            this._auth0Service = auth0Service;
            this.UserProfile = new Lazy<Task<IAuth0UserProfile>>(async () => await _auth0Service.GetTokenInfo(this));
            this.AuthenticatedUser = new Lazy<Task<User>>(async () =>
            {
                var email = (await this.UserProfile.Value).Email;
                return await _dbContext.Users.SingleOrDefaultAsync(user => user.Email == email);
            });
        }

        public IDictionary<string, StringValues> Headers => this.Request.Headers;

        protected ObjectResult OkOrNotFound<T>(T data) where T : class
        {
            if (data == null) return (ObjectResult)NotFound(data);
            return (ObjectResult)Ok(data);
        }
    }
}
