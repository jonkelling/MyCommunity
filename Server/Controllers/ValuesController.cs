using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        private readonly IConfigurationContext _configurationContext;

        public ValuesController(IConfigurationContext configurationContext)
        {
            this._configurationContext = configurationContext;
        }

        // GET api/values
        [HttpGet]
        public async Task<IEnumerable<string>> Get()
        {
            Func<double> getSeconds = () =>
            {
                return (DateTime.Now - DateTime.Today).TotalSeconds;
            };
            await _configurationContext.Values.AddAsync(new ConfigurationValue() { Id = getSeconds().ToString(), Value = "abc" });
            await _configurationContext.Values.AddAsync(new ConfigurationValue { Id = (getSeconds() + 1).ToString(), Value = "cde" });
            await _configurationContext.SaveChangesAsync();

            var results = from x in _configurationContext.Values
                          from v in new[] { x.Id, x.Value }
                          select v;
            return results.ToList();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return Ok(await _configurationContext.Values.FindAsync(id));
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
            return from x in await _configurationContext.Values.ToAsyncEnumerable().ToList()
                   from y in new[] { x.Id, x.Value }
                   select y;
        }

        [HttpGet("PerfTestOld")]
        public IEnumerable<string> PerfTest()
        {
            return from x in _configurationContext.Values.ToList()
                   from y in new[] { x.Id, x.Value }
                   select y;
        }
    }
}
