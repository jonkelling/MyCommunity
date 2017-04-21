using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    public abstract class BaseController : Controller
    {
        protected readonly IMyCommunityContext _dbContext;
        protected readonly IMapper _mapper;

        public BaseController(IMyCommunityContext dbContext, IMapper mapper)
        {
            this._dbContext = dbContext;
            this._mapper = mapper;
        }
    }
}
