using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.Core;

namespace Server.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class UsersController : Controller
    {
        private readonly IMyCommunityContext _dbContext;

        public UsersController(IMyCommunityContext dbContext)
        {
            this._dbContext = dbContext;
        }

        // GET api/values
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _dbContext.Users.ToAsyncEnumerable().ToList());
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return Ok(await _dbContext.Users.FindAsync(id));
        }

        // POST api/values
        [HttpPost]
        public async Task Post([FromBody]User value)
        {
            await _dbContext.Users.AddAsync(value);
            await _dbContext.SaveChangesAsync();
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody]User value)
        {
            _dbContext.Users.Update(value);
            await _dbContext.SaveChangesAsync();
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
        }

        [HttpGet("PerfTest")]
        public async Task<IEnumerable<string>> PerfTestAsync()
        {
            return from x in await _dbContext.Users.ToAsyncEnumerable().ToList()
                   from y in new[] { x.Email }
                   select y;
        }

        [HttpGet("PerfTestOld")]
        public IEnumerable<string> PerfTest()
        {
            return from x in _dbContext.Users.ToList()
                   from y in new[] { x.Email }
                   select y;
        }
    }
}
