namespace Shared.DTOs.DoctorReservation
{
    public class DoctorReservationDTO
    {
        public int Day { get; set; }
        public string? Time { get; set; }
        public int ResID { get; set; }
        public bool IsAvailable { get; set; }
    }
}
