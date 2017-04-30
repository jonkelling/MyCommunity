using AutoMapper;
using Server.Services;

namespace Server.Controllers
{
    public class PostsController : BaseController
    {
        public PostsController(IMyCommunityContext dbContext, IMapper mapper, IAuth0Service auth0Service) : base(dbContext, mapper, auth0Service)
        {
        }
    }
}