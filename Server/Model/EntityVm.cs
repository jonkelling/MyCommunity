using System;

namespace Server.Model
{
    public abstract class EntityVm
    {
        public DateTime CreatedDateTime { get; set; }
        public DateTime ModifiedDateTime { get; set; }
    }
}