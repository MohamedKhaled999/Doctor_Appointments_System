using AutoMapper;
using Domain.Models;
using Shared.Authentication;
using Shared.DTOs.Admin_Dashboard;
using Shared.DTOs.Doctor;
using Shared.DTOs.Home;
using Shared.DTOs.Search;

namespace Services.MappingProfiles
{
    internal class DoctorMappingProfile : Profile
    {
        public DoctorMappingProfile()
        {
            CreateMap<Doctor, DoctorFeesDTO>();

            CreateMap<Doctor, HomeDoctorDTO>()
                .ForMember(dest => dest.ID, src => src.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, src => src.MapFrom(src => src.FirstName + " " + src.LastName))
                .ForMember(dest => dest.Specialty, src => src.MapFrom(src => src.Specialty.Name))
                .ForMember(dest => dest.Image, src => src.MapFrom(src => src.ImageURL))
                .ForMember(dest => dest.Rating, src => src.MapFrom(src => src.OverallRating));

            CreateMap<DoctorRegisterDto, Doctor>()
                .ForMember(dest => dest.Id, src => src.Ignore())
                .ForMember(dest => dest.SpecialtyID, src => src.MapFrom(src => src.SpecialtyID))
                //.ForMember(dest => dest.ImageURL, src => src.MapFrom(src => src.ImageURL)) 
                .ForMember(dest => dest.WorkingDays, src => src.MapFrom(src => 0))
                .ForMember(dest => dest.OverallRating, src => src.Ignore())
                .ForMember(dest => dest.Location, src => src.MapFrom(src => src.Address))
                .ForMember(dest => dest.WaitingTime, src => src.MapFrom(src => src.WaitingTime))
                .ForMember(dest => dest.DefaultStartTime, src => src.MapFrom(src => new DateTime(DateOnly.FromDateTime(DateTime.Now), new TimeOnly(9, 0))))
                .ForMember(dest => dest.DefaultEndTime, src => src.MapFrom(src => new DateTime(DateOnly.FromDateTime(DateTime.Now), new TimeOnly(17, 0))))
                .ForMember(dest => dest.DefaultMaxReservations, src => src.MapFrom(src => 10))
                .ForMember(dest => dest.BirthDate, src => src.MapFrom(src => src.BirthDate.ToDateTime(new TimeOnly(0, 0))));

            CreateMap<DoctorEditDTO, Doctor>()
                .ForMember(dest => dest.Id, src => src.MapFrom(src => src.Id))
                .ForMember(dest => dest.SpecialtyID, src => src.Ignore())
                .ForMember(dest => dest.ImageURL, src => src.Ignore())
                .ForMember(dest => dest.OverallRating, src => src.Ignore())
                .ForMember(dest => dest.Location, src => src.MapFrom(src => src.Address));

            CreateMap<Doctor, DoctorProfileDTO>()
                .ForMember(dest => dest.Speciality, src => src.MapFrom(src => src.Specialty.Name))
                .ForMember(dest => dest.Image, src => src.MapFrom(src => src.ImageURL))
                .ForMember(dest => dest.Name, src => src.MapFrom(src => $"{src.FirstName} {src.LastName}"))
                .ForMember(dest => dest.Phone, src => src.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Rating, src => src.MapFrom(src => src.OverallRating))
                .ForMember(dest => dest.Latitude, src => src.MapFrom(src => src.Lat))
                .ForMember(dest => dest.Longitude, src => src.MapFrom(src => src.Lng));

            CreateMap<Doctor, DoctorUserProfileDTO>()
                .ForMember(dest => dest.Speciality, src => src.MapFrom(src => src.Specialty.Name))
                .ForMember(dest => dest.Image, src => src.MapFrom(src => src.ImageURL))
                .ForMember(dest => dest.Name, src => src.MapFrom(src => $"{src.FirstName} {src.LastName}"))
                .ForMember(dest => dest.Phone, src => src.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Rating, src => src.MapFrom(src => src.OverallRating))
                .ForMember(dest => dest.Latitude, src => src.MapFrom(src => src.Lat))
                .ForMember(dest => dest.Longitude, src => src.MapFrom(src => src.Lng));

            CreateMap<Doctor, DoctorSearchDTO>()
                .ForMember(dest => dest.ID, src => src.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, src => src.MapFrom(src => src.FirstName + " " + src.LastName))
                .ForMember(dest => dest.Speciality, src => src.MapFrom(src => src.Specialty.Name))
                .ForMember(dest => dest.Image, src => src.MapFrom(src => src.ImageURL))
                .ForMember(dest => dest.Rating, src => src.MapFrom(src => src.OverallRating))
                .ForMember(dest => dest.Phone, src => src.MapFrom(src => src.PhoneNumber));

            CreateMap<Doctor, UnApprovedDoctorDTO>()
                .ForMember(dest => dest.Specialty, src => src.MapFrom(src => src.Specialty.Name))
                .ForMember(dest => dest.Name, src => src.MapFrom(src => $"{src.FirstName} {src.LastName}"));
                
        }
    }
}
