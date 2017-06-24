using System.ComponentModel.DataAnnotations;

namespace Server.Core
{
    public class FeedbackMessage : Entity
    {
        public int Id { get; set; }
        [Required] public virtual User User { get; set; }
        public string Message { get; set; }
    }
}