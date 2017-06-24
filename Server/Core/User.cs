using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Core
{
    public class User : Entity
    {
        public int Id { get; set; }

        [StringLength(128), Required, EmailAddress]
        public string Email { get; set; }

        [StringLength(50), Required]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string MiddleName { get; set; }

        [StringLength(50), Required]
        public string LastName { get; set; }

        public int? CommunityId { get; set; }
        public virtual Community Community { get; set; }

        [Required]
        public virtual UserRole UserRole { get; set; }

        [InverseProperty(nameof(Post.Author))]
        public virtual IEnumerable<Post> AuthoredPosts { get; set; }

        public virtual IEnumerable<FeedbackMessage> FeedbackMessages { get; set; }
    }
}