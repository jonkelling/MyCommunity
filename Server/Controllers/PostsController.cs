using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Server.Core;
using Server.Model;
using Server.Services;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System;
using Microsoft.Extensions.Primitives;
using System.Collections.Generic;

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
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Get(int communityId)
        {
            var results = from post in _dbContext.Posts.Include(post => post.Author)
                          where post.Author.CommunityId == communityId
                          select post;
            return Ok(_mapper.Map<IEnumerable<PostVm>>(await results.ToListAsync()));
        }

        [HttpGet("{id}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Get(int communityId, int id)
        {
            var results = from post in _dbContext.Posts.Include(post => post.Author)
                          where post.Author.CommunityId == communityId
                          where post.Id == id
                          select post;
            return OkOrNotFound(_mapper.Map<PostVm>(await results.SingleOrDefaultAsync()));
        }

        [HttpPost]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        [TypeFilter(typeof(ValidateUserIsPostAuthorFilterAttribute))]
        public async Task<IActionResult> Post(int communityId, [FromBody]PostVm value)
        {
            var post = _mapper.Map<Post>(value);
            post.Author = await _dbContext.Users.FindAsync(post.Author.Id);
            await _dbContext.Posts.AddAsync(post);
            return Ok(await _dbContext.SaveChangesAsync());
        }

        [HttpPut("{id}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        [TypeFilter(typeof(ValidateUserIsPostAuthorFilterAttribute))]
        public async Task<IActionResult> Put(int communityId, int id, [FromBody]PostVm value)
        {
            _dbContext.Posts.Update(_mapper.Map<Post>(value));
            return Ok(await _dbContext.SaveChangesAsync());
        }

        [HttpDelete("{id}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        [TypeFilter(typeof(ValidateUserIsPostAuthorByIdFilterAttribute))]
        public async Task<IActionResult> Delete(int communityId, int id)
        {
            var post = await _dbContext.Posts.FindAsync(id);
            _dbContext.Posts.Remove(post);
            return Ok(await _dbContext.SaveChangesAsync());
        }
    }
}