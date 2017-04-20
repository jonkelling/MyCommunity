using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Server
{
    public interface IMyCommunityContext
    {
        DbSet<ConfigurationValue> Values { get; }

        Task<int> SaveChangesAsync(CancellationToken CancellationToken = default(CancellationToken));
    }
}
