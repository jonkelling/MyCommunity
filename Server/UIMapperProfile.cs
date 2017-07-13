using AutoMapper;
using Server.Model;
using Server.Core;

namespace Server
{
    public class UIMapperProfile : Profile
    {
        public UIMapperProfile()
        {
            // CreateMap<Entity, EntityVm>().AfterMap((e, v) => {
            //     v.CreatedDateTime = v.CreatedDateTime.ToUniversalTime();
            //     v.ModifiedDateTime = v.ModifiedDateTime.ToUniversalTime();
            // });

            CreateMap<User, UserVm>();
            CreateMap<Community, CommunityVm>();
            CreateMap<Post, PostVm>(); // .IncludeBase<Entity, EntityVm>();
            CreateMap<Event, EventVm>();
            CreateMap<EventAttendee, EventAttendeeVm>();
            CreateMap<FeedbackMessage, FeedbackMessageVm>();

            CreateMap<UserVm, User>();
            CreateMap<CommunityVm, Community>();
            CreateMap<PostVm, Post>();
            CreateMap<EventVm, Event>();
            CreateMap<FeedbackMessageVm, FeedbackMessage>();
        }
    }
}