using AutoMapper;
using Domain.Models;
using Shared.DTOs.Patient;

namespace Services.MappingProfiles
{
    internal class PatientMappingProfile : Profile
    {
        public PatientMappingProfile()
        {
            CreateMap<PatientDTO, Patient>()
                .ForMember(dest => dest.BirthDate, src => src.MapFrom(src => new DateTime(src.BirthDate, new TimeOnly())))
                .ForMember(dest => dest.Appointments, src => src.Ignore())
                .ForMember(dest => dest.Reviews, src => src.Ignore())
                .ForMember(dest => dest.Orders, src => src.Ignore());

            CreateMap<Patient, PatientDTO>()
                .ForMember(dest => dest.BirthDate, src => src.MapFrom(src => DateOnly.FromDateTime(src.BirthDate)));
        }
    }
}
