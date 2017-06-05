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
        public async Task<IActionResult> Get(
            int communityId,
            [FromQuery] DateTime? before = null,
            [FromQuery] DateTime? after = null,
            [FromQuery] int? limit = null)
        {
            var results = from post in _dbContext.Posts.Include(post => post.Author)
                          where post.Author.CommunityId == communityId
                          select post;

            if (before.HasValue)
            {
                results = from post in results
                          where post.CreatedDateTime < before.Value.ToUniversalTime()
                          orderby post.CreatedDateTime descending
                          select post;
            }
            
            if (after.HasValue)
            {
                results = from post in results
                          where post.CreatedDateTime > after.Value.ToUniversalTime()
                          orderby post.CreatedDateTime ascending
                          select post;
            }

            if (limit.HasValue)
            {
                results = results.Take(limit.Value);
            }

            return Ok(_mapper.Map<IEnumerable<PostVm>>(await results.ToListAsync()));
        }

        [HttpGet("{postId}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Get(int communityId, int postId)
        {
            var results = from post in _dbContext.Posts.Include(post => post.Author)
                          where post.Author.CommunityId == communityId
                          where post.Id == postId
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
            await _dbContext.SaveChangesAsync();
            return Ok(_mapper.Map<PostVm>(post));
        }

        [HttpPut("{postId}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        [TypeFilter(typeof(ValidateUserIsPostAuthorFilterAttribute))]
        public async Task<IActionResult> Put(int communityId, int postId, [FromBody]PostVm value)
        {
            var post = _mapper.Map<Post>(value);
            post.Author = await _dbContext.Users.FindAsync(post.Author.Id);
            _dbContext.Posts.Update(post);
            return Ok(await _dbContext.SaveChangesAsync());
        }

        [HttpDelete("{postId}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        [TypeFilter(typeof(ValidateUserIsPostAuthorByIdFilterAttribute))]
        public async Task<IActionResult> Delete(int communityId, int postId)
        {
            var post = await _dbContext.Posts.FindAsync(postId);
            _dbContext.Posts.Remove(post);
            return Ok(await _dbContext.SaveChangesAsync());
        }
    }
}