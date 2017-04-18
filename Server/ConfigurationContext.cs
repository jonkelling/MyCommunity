using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Server
{
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
                var connectionStringConfigBuilder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .AddEnvironmentVariables();

                var connectionStringConfig = connectionStringConfigBuilder.Build();

                var builder = new DbContextOptionsBuilder();
                builder.UseSqlServer(connectionStringConfig.GetConnectionString("AzureSqlConnection"));
                return builder.Options;
            }
        }
        public DbSet<ConfigurationValue> Values { get; set; }
    }
}
