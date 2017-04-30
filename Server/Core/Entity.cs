using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Core
{
    public abstract class Entity
    {
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}