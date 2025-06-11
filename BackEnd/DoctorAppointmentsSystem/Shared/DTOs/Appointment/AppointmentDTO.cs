namespace Shared.DTOs.Appointment
{
    public class AppointmentDTO
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public string Specialty { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool Canceled { get; set; }
        public string? DocumentUrls { get; set; }
        public string Location { get; set; }
        public string Doctor { get; set; }
        public string DoctorImagePath { get; set; }
        public int DoctorReservationID { get; set; }
        public string? PrescriptionUrl { get; set; }
    }
}
