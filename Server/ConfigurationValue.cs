using Microsoft.EntityFrameworkCore;

namespace Server
{
    public class ConfigurationValue
    {
        public string Id { get; set; }
        public string Value { get; set; }
    }

    public class ConfigurationContext : DbContext
    {
        public ConfigurationContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<ConfigurationValue> Values { get; set; }
    }
}
