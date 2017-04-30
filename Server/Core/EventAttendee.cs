using System.ComponentModel.DataAnnotations;

namespace Server.Core
{
    public class EventAttendee : Entity
    {
        public int Id { get; set; }
        [Required] public virtual User User { get; set; }
        [Required] public virtual Event Event { get; set; }
        [Required] public EventAttendeeStatus Status { get; set; }
        [StringLength(255)] public string Comment { get; set; }
    }
}