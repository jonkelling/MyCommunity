using System.ComponentModel.DataAnnotations;

namespace Server.Model
{
    public class PostVm : EntityVm
    {
        public int Id { get; set; }
        [Required] public UserVm Author { get; set; }
        [Required] public string Headline { get; set; }
        public string HeadlineImageUrl { get; set; }
        [Required] public string Content { get; set; }
    }
}