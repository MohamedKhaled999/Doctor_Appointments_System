namespace Domain.Models
{
    public class Order : EntityBase<string>
    {
        public string? CaptureId { get; set; }
        public bool Status { get; set; }
        public double Amount { get; set; }
        public int PatientId { get; set; }
        public int? DoctorReservationId { get; set; }
        public virtual Patient Patient { get; set; }
        public virtual DoctorReservation? DoctorReservation { get; set; }
    }
}
