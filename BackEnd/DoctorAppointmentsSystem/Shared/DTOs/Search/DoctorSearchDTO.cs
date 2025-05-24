using Shared.DTOs.DoctorReservation;
using Shared.Enums;

namespace Shared.DTOs.Search
{
    public class DoctorSearchDTO
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public Gender Gender { get; set; }
        public string Image { get; set; }
        public string Qualifications { get; set; }
        public int Fees { get; set; }
        public string Speciality { get; set; }
        public float Rating { get; set; }
        public int WaitingTime { get; set; }
        public Governorate Governorate { get; set; }
        public string Location { get; set; }
        public string Phone { get; set; }
        //public List<DoctorReservationDTO> Appointments { get; set; }
    }
}
