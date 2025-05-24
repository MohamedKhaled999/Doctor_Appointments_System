using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.MappingProfiles
{
    public class SpecialtyMappingProfile : AutoMapper.Profile
    {
        public SpecialtyMappingProfile()
        {
            CreateMap<Domain.Models.Specialty, Shared.DTOs.Doctor.SpecialtyDTO>()
                .ForMember(dest => dest.ID, src => src.MapFrom(src => src.Id))
                .ReverseMap();
        }
    }
}
