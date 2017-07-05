using System;
using System.Collections.Generic;
using System.Linq;

namespace Server.Model
{
    public static class ModelExtensions
    {
        public static IEnumerable<PostVm> ClearDataFromExpiredPosts(this IEnumerable<PostVm> postVms)
        {
            return postVms.Select(ClearDataFromExpiredPost);
        }

        public static PostVm ClearDataFromExpiredPost(this PostVm postVm)
        {
            if (postVm.ExpireDateTime.HasValue && postVm.ExpireDateTime.Value <= DateTime.UtcNow)
            {
                postVm.Content = null;
                postVm.Headline = null;
                postVm.HeadlineImageUrl = null;
                postVm.Author = null;
            }
            return postVm;
        }
    }
}