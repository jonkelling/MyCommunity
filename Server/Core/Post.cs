using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Core
{
    public class Post : Entity
    {
        public int Id { get; set; }

        [InverseProperty(nameof(User.AuthoredPosts))]
        [Required] public virtual User Author { get; set; }

        [StringLength(140), Required]
        public string Headline { get; set; }

        [Url] public string HeadlineImageUrl { get; set; }

        public string Content { get; set; }
    }
}