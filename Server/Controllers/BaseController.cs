using System;
using System.Collections.Generic;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Server.Services;

namespace Server.Controllers
{
    public abstract class BaseController : Controller, IHeaderProvider
    {
        protected readonly IMyCommunityContext _dbContext;
        protected readonly IMapper _mapper;
        protected readonly IAuth0Service _auth0Service;

        public BaseController(IMyCommunityContext dbContext, IMapper mapper, IAuth0Service auth0Service)
        {
            this._dbContext = dbContext;
            this._mapper = mapper;
            this._auth0Service = auth0Service;
        }

        public IDictionary<string, StringValues> Headers => this.Request.Headers;
    }
}
