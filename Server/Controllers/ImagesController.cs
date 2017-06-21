using System.Collections.Generic;
using System.IO;
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
        public async Task<IActionResult> GetAsync(int communityId, string filename)
        {
            return File(await azureBlobStorageService.GetBlob(filename), MimeTypeMap.GetMimeType(filename));
        }

        [HttpPost("")]
        [HttpPut("")]
        // [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Put(int communityId, IFormFile file)
        {
            if (file == null && Request.Form.Files.Count == 0)
            {
                return BadRequest("Files missing from request.");
            }
            file = file ?? Request.Form.Files[0];
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                ms.Position = 0;
                var newFilename = await azureBlobStorageService.PutBlob(file.FileName, ms.ReadAllBytes());
                var response = CreatedAtAction(nameof(GetAsync),
                    new { communityId, filename = newFilename },
                    new { filename = azureBlobStorageService.GetImageUrl(newFilename) });
                return response;
            }
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