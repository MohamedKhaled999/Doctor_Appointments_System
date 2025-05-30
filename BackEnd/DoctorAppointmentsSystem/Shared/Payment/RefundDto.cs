namespace Shared.Payment
{
    public class RefundDto
    {
        public string PaymentId { get; set; }
        public double Amount { get; set; }

        public bool IsPartial { get; set; }
        public float Percent { get; set; } = 1F; // Default to 100% refund

    }
}
