using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Core
{
    public abstract class Entity
    {
        public DateTime CreatedDateTime { get; set; }
        public DateTime ModifiedDateTime { get; set; }
    }
}