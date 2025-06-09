namespace Shared.DTOs.DoctorReservation
{
    public class DoctorReservationDTO
    {
        public int DoctorID { get; set; }
        public int Id { get; set; }
        public int Day { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsAvailable { get; set; }
    }
}
