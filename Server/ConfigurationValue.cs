using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Server
{
    public class ConfigurationValue
    {
        public string Id { get; set; }
        public string Value { get; set; }
    }

    public class ConfigurationContext : DbContext
    {
        public ConfigurationContext() : this(getDefaultOptions)
        {
        }

        public ConfigurationContext(DbContextOptions options) : base(options)
        {
        }

        public static DbContextOptions getDefaultOptions
        {
            get
            {
                var connectionStringConfigBuilder = new ConfigurationBuilder();
                connectionStringConfigBuilder.SetBasePath(Directory.GetCurrentDirectory());
                connectionStringConfigBuilder.AddJsonFile("appsettings.json");
                var connectionStringConfig = connectionStringConfigBuilder.Build();

                var builder = new DbContextOptionsBuilder();
                builder.UseNpgsql(connectionStringConfig.GetConnectionString("DefaultConnection"));
                return builder.Options;
            }
        }
        public DbSet<ConfigurationValue> Values { get; set; }
    }
}
