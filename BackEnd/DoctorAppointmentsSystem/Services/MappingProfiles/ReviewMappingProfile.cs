using AutoMapper;
using Domain.Models;
using Shared.DTOs.Doctor;
using Shared.DTOs.Patient;

namespace Services.MappingProfiles
{
    internal class ReviewMappingProfile : Profile
    {
        public ReviewMappingProfile()
        {
            CreateMap<Review, ReviewDTO>()
                .ForMember(dest => dest.ID, src => src.MapFrom(src => src.Id))
                .ForMember(dest => dest.PatientName, src => src.MapFrom(src => $"{src.Patient.FirstName} {src.Patient.LastName}"))
                .ForMember(dest => dest.Date, src => src.MapFrom(src => src.Date.Date.ToString()))
                .ForMember(dest => dest.Review, src => src.MapFrom(src => src.Description))
                .ForMember(dest => dest.Rate, src => src.MapFrom(src => src.Rate)) // int to float?
                .ForMember(dest => dest.DocID, src => src.MapFrom(src => src.DoctorID));

            CreateMap<ReviewDTO, Review>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Review))
                .ForMember(dest => dest.Rate, opt => opt.MapFrom(src => (int)src.Rate))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.DoctorID, opt => opt.MapFrom(src => src.DocID))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ID))
                .ForMember(dest => dest.PatientID, opt => opt.Ignore())
                .ForMember(dest => dest.Doctor, opt => opt.Ignore())
                .ForMember(dest => dest.Patient, opt => opt.Ignore());

            CreateMap<AddReviewDTO, Review>()
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Review))
                .ForMember(dest => dest.Rate, opt => opt.MapFrom(src => (int)src.Rate))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.Now));
                


        }
    }
}
