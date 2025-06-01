namespace Domain.Models
{
    public class Appointment : EntityBase<int>
    {
        public int DoctorReservationID { get; set; }
        public int PatientId { get; set; }
        public int TransactionId { get; set; }
        public string[]? DocumentUrls { get; set; }
        public virtual DoctorReservation DoctorReservation { get; set; }
        public virtual Patient Patient { get; set; }
        public virtual Transaction Transaction { get; set; }
    }
}
