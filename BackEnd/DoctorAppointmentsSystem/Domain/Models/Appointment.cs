namespace Domain.Models
{
    public class Appointment : EntityBase<int>
    {
        public int DoctorReservationID { get; set; }
        public int PatientId { get; set; }
        public virtual DoctorReservation DoctorReservation { get; set; }
        public virtual Patient Patient { get; set; }
    }
}
