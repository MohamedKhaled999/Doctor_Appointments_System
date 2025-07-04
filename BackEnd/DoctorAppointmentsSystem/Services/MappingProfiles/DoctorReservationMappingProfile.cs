﻿using AutoMapper;
using Domain.Models;
using Shared.DTOs.DoctorReservation;

namespace Services.MappingProfiles
{
    internal class DoctorReservationMappingProfile : Profile
    {
        public DoctorReservationMappingProfile()
        {

            CreateMap<DoctorReservation, DoctorReservationDTO>()
                .ForMember(dest => dest.Day, src => src.MapFrom(src => src.EndTime.Day))
                .ForMember(dest => dest.IsAvailable, src => src.Ignore()); // Ignore this property as it will be set in the service layer

            CreateMap<NewResDTO, DoctorReservation>()
                .ForMember(dest => dest.Id, src => src.MapFrom(src => src.ResID))
                .ForMember(dest => dest.StartTime, src => src.MapFrom(src => src.Date.Date.Add(src.StartTime)))
                .ForMember(dest => dest.EndTime, src => src.MapFrom(src => src.Date.Date.Add(src.EndTime)))
                .ForMember(dest => dest.MaxReservation, src => src.MapFrom(src => src.MaxRes))
                .ForMember(dest => dest.Appointments, src => src.Ignore())
                .ForMember(dest => dest.Doctor, src => src.Ignore());
        }
    }
}
