using System;
using System.Collections.Generic;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace Server.Controllers
{
    public abstract class BaseController : Controller, IHeaderProvider
    {
        protected readonly IMyCommunityContext _dbContext;
        protected readonly IMapper _mapper;

        public BaseController(IMyCommunityContext dbContext, IMapper mapper)
        {
            this._dbContext = dbContext;
            this._mapper = mapper;
        }

        public IDictionary<string, StringValues> Headers => this.Request.Headers;
    }
}
