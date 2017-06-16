using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Services;

namespace Server.Controllers
{
    [ApiVersion("1.0")]
    // [Authorize]
    [Route("api/v{version:apiVersion}/communities/{communityId}/[controller]")]
    public class ImagesController : BaseController
    {
        private readonly IAzureBlobStorageService azureBlobStorageService;

        public ImagesController(
            IMyCommunityContext dbContext,
            IMapper mapper,
            IAuth0Service auth0Service,
            IAzureBlobStorageService azureBlobStorageService
        ) : base(dbContext, mapper, auth0Service)
        {
            this.azureBlobStorageService = azureBlobStorageService;
        }

        [HttpGet("{filename}")]
        // [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Get(int communityId, string filename)
        {
            return File(await azureBlobStorageService.GetBlob(filename), MimeTypeMap.GetMimeType(filename));
        }

        [HttpPut("{filename}")]
        // [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        // [TypeFilter(typeof(ValidateUserIsPostAuthorFilterAttribute))]
        public async Task<IActionResult> Put(int communityId, string filename, [FromBody]IFormFile file)
        {
            var newFilename = await azureBlobStorageService.PutBlob(filename, data);
            return CreatedAtAction(nameof(Get), new { newFilename });
        }

        // [HttpDelete("{filename}")]
        // [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        // [TypeFilter(typeof(ValidateUserIsPostAuthorByIdFilterAttribute))]
        // public async Task<IActionResult> Delete(int communityId, int postId)
        // {
        //     var post = await _dbContext.Posts.FindAsync(postId);
        //     _dbContext.Posts.Remove(post);
        //     await _dbContext.SaveChangesAsync();
        //     return NoContent();
        // }
    }
}