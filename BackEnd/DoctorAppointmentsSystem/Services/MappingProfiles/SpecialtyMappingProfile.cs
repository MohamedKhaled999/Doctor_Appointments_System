using Domain.Models;
using Shared.DTOs.Doctor;
using Shared.DTOs.Home;

namespace Services.MappingProfiles
{
    internal class SpecialtyMappingProfile : AutoMapper.Profile
    {
        public SpecialtyMappingProfile()
        {
            CreateMap<Specialty, SpecialtyDTO>()
                .ForMember(dest => dest.ID, src => src.MapFrom(src => src.Id))
                .ReverseMap();
            CreateMap<NewSpecialtyDTO, Specialty>();
                
        }
    }
}
