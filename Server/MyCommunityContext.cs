using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;

namespace Server
{

    public class MyCommunityContext : DbContext, IMyCommunityContext
    {
        public MyCommunityContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<ConfigurationValue> Values { get; set; }
    }
}
