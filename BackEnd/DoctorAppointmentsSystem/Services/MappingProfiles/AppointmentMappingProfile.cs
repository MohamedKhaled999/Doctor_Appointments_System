using AutoMapper;
using Domain.Models;
using Shared.DTOs.Appointment;

namespace Services.MappingProfiles
{
    internal class AppointmentMappingProfile : Profile
    {
        public AppointmentMappingProfile()
        {
            CreateMap<Appointment, AppointmentDTO>()
                .ForMember(dest => dest.StartTime, src => src.MapFrom(src => src.DoctorReservation.StartTime))
                .ForMember(dest => dest.EndTime, src => src.MapFrom(src => src.DoctorReservation.EndTime))
                .ForMember(dest => dest.Doctor, src => src.MapFrom(src => src.DoctorReservation.Doctor.FirstName + " " + src.DoctorReservation.Doctor.LastName))
                .ForMember(dest => dest.Specialty, src => src.MapFrom(src => src.DoctorReservation.Doctor.Specialty.Name))
                .ForMember(dest => dest.DoctorImagePath, src => src.MapFrom(src => src.DoctorReservation.Doctor.ImageURL));
        }
    }
}
