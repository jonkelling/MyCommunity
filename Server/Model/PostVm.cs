using System;

namespace Server.Model
{
    public class PostVm
    {
        public int Id { get; set; }
        public UserVm Author { get; set; }
        public string Headline { get; set; }
        public Uri HeadlineImageUrl { get; set; }
        public string Content { get; set; }
    }
}