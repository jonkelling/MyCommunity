using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Model
{
    public class PostVm
    {
        public int Id { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime ModifiedDateTime { get; set; }
        [Required] public UserVm Author { get; set; }
        [Required] public string Headline { get; set; }
        public string HeadlineImageUrl { get; set; }
        [Required] public string Content { get; set; }
    }
}