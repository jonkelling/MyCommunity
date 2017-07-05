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
using Newtonsoft.Json.Linq;
using System.Reflection;
using System.Reflection.Metadata;
using Microsoft.AspNetCore.JsonPatch;

namespace Server.Controllers
{
    [ApiVersion("1.0")]
    [Authorize]
    [Route("api/v{version:apiVersion}/communities/{communityId}/[controller]")]
    public class PostsController : BaseController
    {
        private readonly IAzureBlobStorageService azureBlobStorageService;

        public PostsController(
            IMyCommunityContext dbContext,
            IMapper mapper,
            IAuth0Service auth0Service,
            IAzureBlobStorageService azureBlobStorageService
        ) : base(dbContext, mapper, auth0Service)
        {
            this.azureBlobStorageService = azureBlobStorageService;
        }

        private PostVm Map(Post post) => _mapper.Map<PostVm>(post);
        private Post Map(PostVm value) => _mapper.Map<Post>(value);
        private IEnumerable<PostVm> Map(IEnumerable<Post> posts) => _mapper.Map<IEnumerable<PostVm>>(posts);

        [HttpGet]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Get(
            int communityId,
            [FromQuery] DateTime? before = null,
            [FromQuery] DateTime? after = null,
            [FromQuery] int? limit = null,
            [FromQuery] bool includeExpired = false)
        {
            var results = from post in _dbContext.Posts.Include(post => post.Author)
                          where post.Author.CommunityId == communityId
                          where includeExpired || !post.ExpireDateTime.HasValue || post.ExpireDateTime.Value > DateTime.UtcNow
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

            return Ok(Map(await results.ToListAsync()));
        }

        [HttpGet("{postId}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Get(int communityId, int postId)
        {
            var results = from post in _dbContext.Posts.Include(post => post.Author)
                          where post.Author.CommunityId == communityId
                          where post.Id == postId
                          select post;
            return OkOrNotFound(Map(await results.SingleOrDefaultAsync()));
        }

        [HttpGet("expired/ids")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Get(int communityId)
        {
            var results = from post in _dbContext.Posts
                          where post.Author.CommunityId == communityId
                          where post.ExpireDateTime.HasValue && post.ExpireDateTime.Value <= DateTime.UtcNow
                          select post;
            var expiredPosts = await results.ToListAsync();
            var expiredPostIds =
                from expiredPost in expiredPosts
                select expiredPost.Id;
            return OkOrNotFound(expiredPostIds);
        }

        [HttpPost]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        // [TypeFilter(typeof(ValidateUserIsPostAuthorFilterAttribute))]
        public async Task<IActionResult> Post(int communityId, [FromBody]PostVm value)
        {
            var post = Map(value);
            post.Author = await _dbContext.Users.FindAsync(post.Author.Id);
            await _dbContext.Posts.AddAsync(post);
            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new
            {
                CommunityId = communityId,
                PostId = post.Id
            }, Map(post));
        }

        [HttpPut("{postId}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        [TypeFilter(typeof(ValidateUserIsPostAuthorFilterAttribute))]
        public async Task<IActionResult> Put(int communityId, int postId, [FromBody]PostVm value)
        {
            var post = Map(value);
            post.Author = await _dbContext.Users.FindAsync(post.Author.Id);
            _dbContext.Posts.Update(post);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{postId}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        [TypeFilter(typeof(ValidateUserIsPostAuthorByIdFilterAttribute))]
        public async Task<IActionResult> Delete(int communityId, int postId)
        {
            var post = await _dbContext.Posts.FindAsync(postId);
            _dbContext.Posts.Remove(post);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{postId}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        [TypeFilter(typeof(ValidateUserIsPostAuthorByIdFilterAttribute))]
        public async Task<IActionResult> Patch(
            int communityId,
            int postId,
            [FromBody]JsonPatchDocument<IPostExpireDateTimePatch> patch)
        {
            var post = await _dbContext.Posts.Include(x => x.Author).SingleOrDefaultAsync(x => x.Id == postId);

            if (post == null)
            {
                return NotFound();
            }

            var original = Map(post);

            // only allow PATCH for ExpireDateTime right now.
            if (patch.Operations.Any(op => !string.Equals(op.path, $"/{nameof(post.ExpireDateTime)}", StringComparison.OrdinalIgnoreCase)))
            {
                return new BadRequestResult();
            }

            patch.ApplyTo((IPostExpireDateTimePatch)post, ModelState);

            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }

            await _dbContext.SaveChangesAsync();

            var model = new
            {
                original,
                patched = Map(post)
            };

            return Ok(model);
        }
    }


}