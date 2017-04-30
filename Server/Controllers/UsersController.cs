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
    public class UsersController : BaseController
    {
        public UsersController(IMyCommunityContext dbContext, IMapper mapper, IAuth0Service auth0Service) : base(dbContext, mapper, auth0Service)
        {
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var results = _dbContext.Users;
            return Ok(_mapper.Map<IEnumerable<UserVm>>(await results.ToListAsync()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return Ok(_mapper.Map<UserVm>(await _dbContext.Users.FindAsync(id)));
        }

        [HttpGet]
        public async Task<IActionResult> Get([RequiredFromQuery]string email)
        {
            var results = from x in _dbContext.Users
                          where x.Email == email
                          select x;
            var profile = await _auth0Service.GetTokenInfo(this);
            return Ok(_mapper.Map<IEnumerable<UserVm>>(await results.ToListAsync()));
        }

        [HttpPost]
        public async Task Post([FromBody]UserVm value)
        {
            await _dbContext.Users.AddAsync(_mapper.Map<User>(value));
            await _dbContext.SaveChangesAsync();
        }

        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody]UserVm value)
        {
            _dbContext.Users.Update(_mapper.Map<User>(value));
            await _dbContext.SaveChangesAsync();
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
        }

        [HttpGet("PerfTest")]
        public async Task<IActionResult> PerfTestAsync()
        {
            return Ok(_mapper.Map<IEnumerable<UserVm>>(await _dbContext.Users.ToListAsync()));
        }

        [HttpGet("PerfTestOld")]
        public IActionResult PerfTest()
        {
            return Ok(_mapper.Map<IEnumerable<UserVm>>(_dbContext.Users.ToList()));
        }
    }
}
