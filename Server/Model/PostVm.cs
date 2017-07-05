using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Model
{
    public class PostVm : EntityVm, IPostExpireDateTimePatch
    {
        public int Id { get; set; }
        [Required] public UserVm Author { get; set; }
        [Required] public string Headline { get; set; }
        public string HeadlineImageUrl { get; set; }
        [Required] public string Content { get; set; }
        public DateTime? ExpireDateTime { get; set; }
    }

    public interface IPostExpireDateTimePatch
    {
        DateTime? ExpireDateTime { get; set; }        
    }
}