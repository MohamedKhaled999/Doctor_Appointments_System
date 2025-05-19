namespace Shared.DTOs.Home
{
    public class HomeDTO
    {
        public List<string> Specialties { get; set; }
        public List<HomeDoctorDTO> Doctors { get; set; }
        public Dictionary<int, int?> DoctorsPerSpecialtyCount { get; set; }
    }
}
