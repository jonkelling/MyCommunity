using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Core;
using Server.Model;

namespace Server.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class CommunitiesController : BaseController
    {
        public CommunitiesController(IMyCommunityContext dbContext, IMapper mapper) : base(dbContext, mapper)
        { }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(_mapper.Map<IEnumerable<CommunityVm>>(await _dbContext.Communities.ToListAsync()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return Ok(_mapper.Map<CommunityVm>(await _dbContext.Communities.FindAsync(id)));
        }

        [HttpPost]
        public async Task Post([FromBody]CommunityVm community)
        {
            await _dbContext.Communities.AddAsync(_mapper.Map<Community>(community));
            await _dbContext.SaveChangesAsync();
        }

        [HttpPut]
        public async Task Put([FromBody]CommunityVm community)
        {
            _dbContext.Communities.Update(_mapper.Map<Community>(community));
            await _dbContext.SaveChangesAsync();
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            var community = await _dbContext.Communities.FindAsync(id);
            _dbContext.Communities.Remove(community);
            await _dbContext.SaveChangesAsync();
        }
    }
}
