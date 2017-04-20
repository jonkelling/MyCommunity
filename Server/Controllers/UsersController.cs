using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IEnumerable<string>> Get()
        {
            var results = from x in _dbContext.Users
                          from v in new[] { x.Email }
                          select v;
            return await results.ToAsyncEnumerable().ToList();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return Ok(await _dbContext.Users.FindAsync(id));
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
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
