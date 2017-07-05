using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Server.Model;

namespace Server.Core
{
    public class Post : Entity, IPostExpireDateTimePatch
    {
        public int Id { get; set; }

        [Required, InverseProperty(nameof(User.AuthoredPosts))]
        public virtual User Author { get; set; }

        [Required, StringLength(140)]
        public string Headline { get; set; }

        [Url] public string HeadlineImageUrl { get; set; }

        public string Content { get; set; }

        public DateTime? ExpireDateTime { get; set; }
    }
}