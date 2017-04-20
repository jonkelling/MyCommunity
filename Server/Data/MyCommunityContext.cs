using Microsoft.EntityFrameworkCore;
using Server.Core;

namespace Server.Data
{

    public class MyCommunityContext : DbContext, IMyCommunityContext
    {
        public MyCommunityContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Community> Communities { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
