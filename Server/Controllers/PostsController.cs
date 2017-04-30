using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Core;
using Server.Model;
using Server.Services;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Server.Controllers
{
    [ApiVersion("1.0")]
    [Authorize]
    [Route("api/v{version:apiVersion}/communities/{communityId}/[controller]")]
    public class PostsController : BaseController
    {
        public PostsController(IMyCommunityContext dbContext, IMapper mapper, IAuth0Service auth0Service) : base(dbContext, mapper, auth0Service)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Get(int communityId)
        {
            var user = await this.AuthenticatedUser.Value;
            if (user.CommunityId != communityId)
                return Unauthorized();
            var results = from post in _dbContext.Posts
                          where post.Author.CommunityId == communityId
                          select post;
            return base.Ok(await results.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int communityId, int id)
        {
            var user = await this.AuthenticatedUser.Value;
            if (user.CommunityId != communityId)
                return Unauthorized();
            var results = from post in _dbContext.Posts
                          where post.Author.CommunityId == communityId
                          where post.Id == id
                          select post;
            return OkOrNotFound(await results.SingleOrDefaultAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Post(int communityId, [FromBody]PostVm value)
        {
            var user = await this.AuthenticatedUser.Value;
            if (user.Id != value.Author.Id)
                return Unauthorized();
            if (user.CommunityId != communityId)
                return Unauthorized();
            await _dbContext.Posts.AddAsync(_mapper.Map<Post>(value));
            return Ok(await _dbContext.SaveChangesAsync());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int communityId, int id, [FromBody]PostVm value)
        {
            var user = await this.AuthenticatedUser.Value;
            if (user.Id != value.Author.Id)
                return Unauthorized();
            if (user.CommunityId != communityId)
                return Unauthorized();
            _dbContext.Posts.Update(_mapper.Map<Post>(value));
            return Ok(await _dbContext.SaveChangesAsync());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int communityId, int id)
        {
            var user = await this.AuthenticatedUser.Value;
            if (user.CommunityId != communityId)
                return Unauthorized();
            var post = await _dbContext.Posts.FindAsync(id);
            if (post.Author != user)
                return Unauthorized();
            _dbContext.Posts.Remove(post);
            return Ok(await _dbContext.SaveChangesAsync());
        }
    }
}