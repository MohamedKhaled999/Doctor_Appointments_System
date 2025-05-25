namespace Domain.Models
{
    public class Transaction : EntityBase<int>
    {
        public double Amount { get; set; }
        public DateTime TimeStamp { get; set; }
        public int? PatientId { get; set; }
        public int DoctorId { get; set; }
        public virtual Patient? Patient { get; set; }
        public virtual Doctor Doctor { get; set; }
    }
}
