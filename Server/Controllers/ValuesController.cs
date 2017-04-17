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
        // GET api/values
        [HttpGet]
        public async Task<IEnumerable<string>> Get()
        {
            using (var context = new ConfigurationContext())
            {
                Func<double> getSeconds = () =>
                {
                    return (DateTime.Now - DateTime.Today).TotalSeconds;
                };
                await context.Values.AddAsync(new ConfigurationValue() { Id = getSeconds().ToString(), Value = "abc" });
                await context.Values.AddAsync(new ConfigurationValue { Id = (getSeconds() + 1).ToString(), Value = "cde" });
                await context.SaveChangesAsync();
            }

            using (var context = new ConfigurationContext())
            {
                var results = from x in context.Values
                              from v in new[] { x.Id, x.Value }
                              select v;
                return results.ToList();
            }
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
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
        public async Task<IEnumerable<string>> PerfTest()
        {
            using (var dbContext = new ConfigurationContext())
            {
                var results = from x in dbContext.Values.ToList()
                              from y in new[] { x.Id, x.Value }
                              select y;
                return await Task.FromResult(results);
            }
        }
    }
}
