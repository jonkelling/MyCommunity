using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.Core;

namespace Server
{
    public interface IMyCommunityContext
    {
        DbSet<Community> Communities { get; }
        DbSet<User> Users { get; }

        Task<int> SaveChangesAsync(CancellationToken CancellationToken = default(CancellationToken));
    }
}
