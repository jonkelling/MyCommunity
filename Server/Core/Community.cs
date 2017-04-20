using System.Collections.Generic;

namespace Server.Core
{
    public class Community
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<User> Users { get; set; }
    }
}