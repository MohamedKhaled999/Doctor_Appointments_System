using AutoMapper;
using Domain.Models;
using Shared.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.MappingProfiles.Authentication
{
    public class AuthenticationProfile:Profile
    {
        public AuthenticationProfile()
        {
            //// map RegisterDto to Patient
            //CreateMap<RegisterDto, Patient>()
            //    .ReverseMap();
            //// map RegisterDto to Doctor
            //CreateMap<DoctorRegisterDto, Doctor>()
            //    .ForMember(dest => dest.Location, src => src.MapFrom(s => s.Address))
            //    .ForMember(dest => dest., src => src.MapFrom(s => s.Address));
               
            
        }

    }
}
