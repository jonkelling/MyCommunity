using AutoMapper;
using Server.Model;
using Server.Core;

namespace Server
{
    public class UIMapperProfile : Profile
    {
        public UIMapperProfile()
        {
            CreateMap<User, UserVm>();
            CreateMap<Community, CommunityVm>();

            CreateMap<UserVm, User>();
            CreateMap<CommunityVm, Community>();
        }
    }
}