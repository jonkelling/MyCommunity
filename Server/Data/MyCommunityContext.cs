using Microsoft.EntityFrameworkCore;
using Server.Core;

namespace Server.Data
{

    public class MyCommunityContext : DbContext, IMyCommunityContext
    {
        public MyCommunityContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

        public DbSet<Community> Communities { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Event> Events { get; set; }
    }
}
