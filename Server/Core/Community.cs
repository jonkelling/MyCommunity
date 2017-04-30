using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.Core
{
    public class Community : Entity
    {
        public int Id { get; set; }

        [StringLength(128), Required]
        public string Name { get; set; }
        
        public virtual IEnumerable<User> Users { get; set; }
    }
}