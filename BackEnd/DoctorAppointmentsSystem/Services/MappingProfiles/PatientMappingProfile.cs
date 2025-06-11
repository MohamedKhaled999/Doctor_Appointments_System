using AutoMapper;
using Domain.Models;
using Shared.Authentication;
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
                .ForMember(dest => dest.Transactions, src => src.Ignore());

            CreateMap<Patient, PatientDTO>()
                .ForMember(dest => dest.BirthDate, src => src.MapFrom(src => DateOnly.FromDateTime(src.BirthDate)));

            CreateMap<Patient, PatientAppUserDTO>()
                .ForMember(dest => dest.BirthDate, src => src.MapFrom(src => DateOnly.FromDateTime(src.BirthDate)));


            // map RegisterDto to Patient
            CreateMap<RegisterDto, Patient>()
             .ForMember(dest => dest.BirthDate, src =>
             src.MapFrom(src => src.BirthDate.ToDateTime(new TimeOnly(0, 0))))

                .ReverseMap();
        }
    }
}
