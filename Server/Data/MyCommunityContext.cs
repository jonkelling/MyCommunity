using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            DateTime saveTime = DateTime.UtcNow;
            foreach (var entry in this.ChangeTracker.Entries<Entity>()
                .Where(e => e.State == Microsoft.EntityFrameworkCore.EntityState.Added))
            {
                entry.Property("CreatedDateTime").CurrentValue = saveTime;
                entry.Property("ModifiedDateTime").CurrentValue = saveTime;
            }
            foreach (var entry in this.ChangeTracker.Entries<Entity>()
                .Where(e => e.State == Microsoft.EntityFrameworkCore.EntityState.Modified))
            {
                entry.Property("CreatedDateTime").IsModified = false;
                entry.Property("ModifiedDateTime").CurrentValue = saveTime;
            }
            return await base.SaveChangesAsync(cancellationToken);
        }

        public DbSet<Community> Communities { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<FeedbackMessage> FeedbackMessages { get; set; }
    }
}
