using System;

namespace Server.Model
{
    public class PostVm
    {
        public int Id { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime ModifiedDateTime { get; set; }
        public UserVm Author { get; set; }
        public string Headline { get; set; }
        public string HeadlineImageUrl { get; set; }
        public string Content { get; set; }
    }
}