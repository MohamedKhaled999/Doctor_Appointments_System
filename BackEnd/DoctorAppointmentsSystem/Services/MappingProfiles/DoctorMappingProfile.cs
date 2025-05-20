using AutoMapper;
using Domain.Models;
using Shared.DTOs.Home;

namespace Services.MappingProfiles
{
    internal class DoctorMappingProfile : Profile
    {
        public DoctorMappingProfile()
        {
            CreateMap<Doctor, HomeDoctorDTO>()
                .ForMember(dest => dest.ID, src => src.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, src => src.MapFrom(src => src.FirstName + " " + src.LastName))
                .ForMember(dest => dest.Specialty, src => src.MapFrom(src => src.Specialty.Name))
                .ForMember(dest => dest.Image, src => src.MapFrom(src => src.ImageURL))
                .ForMember(dest => dest.Rating, src => src.MapFrom(src => src.OverallRating));
        }
    }
}
