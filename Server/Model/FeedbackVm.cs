using System.ComponentModel.DataAnnotations;

namespace Server.Model
{
    public class FeedbackMessageVm : EntityVm
    {
        public int Id { get; set; }
        [Required] public UserVm User { get; set; }
        [Required] public string Message { get; set; }
    }
}