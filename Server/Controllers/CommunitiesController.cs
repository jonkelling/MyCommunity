using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Core;
using Server.Model;
using Server.Services;

namespace Server.Controllers
{
    [ApiVersion("1.0")]
    [Authorize]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class CommunitiesController : BaseController
    {
        public CommunitiesController(IMyCommunityContext dbContext, IMapper mapper, IAuth0Service auth0Service) : base(dbContext, mapper, auth0Service)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var user = await this.AuthenticatedUser.Value;
            var communities = from c in _dbContext.Communities
                              where c.Users.Any(u => u.Id == user.Id)
                              select c;
            return base.Ok(_mapper.Map<IEnumerable<CommunityVm>>(await communities.ToListAsync()));
        }

        [HttpGet("{id}")]
        [TypeFilter(typeof(ValidateCommunityUserFilterAttribute))]
        public async Task<IActionResult> Get(int communityId)
        {
            return Ok(_mapper.Map<CommunityVm>(await _dbContext.Communities.FindAsync(communityId)));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]CommunityVm community)
        {
            await _dbContext.Communities.AddAsync(_mapper.Map<Community>(community));
            return Ok(await _dbContext.SaveChangesAsync());
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody]CommunityVm community)
        {
            _dbContext.Communities.Update(_mapper.Map<Community>(community));
            return Ok(await _dbContext.SaveChangesAsync());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int communityId)
        {
            if ((await this.AuthenticatedUser.Value).UserRole != UserRole.GlobalAdministrator)
            {
                return Forbid();
            }
            var community = await _dbContext.Communities.FindAsync(communityId);
            _dbContext.Communities.Remove(community);
            return Ok(await _dbContext.SaveChangesAsync());
        }
    }
}
