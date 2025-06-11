namespace Shared.DTOs.Transaction
{
    public class TransactionDTO
    {
        public double Amount { get; set; }
        public DateTime TimeStamp { get; set; }
        public string PaymentId { get; set; }
        public int? PatientId { get; set; }
        public int DoctorId { get; set; }
    }
}
