using Domain.Models;
using Shared.DTOs.Doctor;

namespace Services.MappingProfiles
{
    internal class SpecialtyMappingProfile : AutoMapper.Profile
    {
        public SpecialtyMappingProfile()
        {
            CreateMap<Specialty, SpecialtyDTO>()
                .ForMember(dest => dest.ID, src => src.MapFrom(src => src.Id))
                .ReverseMap();
        }
    }
}
