using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Server
{
    public interface IConfigurationContext
    {
        DbSet<ConfigurationValue> Values { get; }

        Task<int> SaveChangesAsync(CancellationToken CancellationToken = default(CancellationToken));
    }
    
    public class ConfigurationContext : DbContext, IConfigurationContext
    {
        public ConfigurationContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<ConfigurationValue> Values { get; set; }
    }
}
