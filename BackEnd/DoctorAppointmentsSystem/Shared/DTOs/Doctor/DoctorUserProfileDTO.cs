using Shared.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOs.Doctor
{
    public class DoctorUserProfileDTO
    {
        public int ID { get; set; }
        public string Name { get; set; }
        //public string Title { get; set; }
        public Gender Gender { get; set; }
        public string Image { get; set; }
        public string About { get; set; }
        //public string Qualifications { get; set; }
        public int Fees { get; set; }
        public string Speciality { get; set; }
        public float Rating { get; set; }
        public int WaitingTime { get; set; }
        public Governorate Governorate { get; set; }
        public string Location { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public float Latitude { get; internal set; }
        public float Longitude { get; internal set; }
    }
}
