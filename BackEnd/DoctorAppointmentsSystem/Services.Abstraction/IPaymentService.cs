using Shared.Payment;

namespace Services.Abstraction
{
    public interface IPaymentService
    {
        public Task<string> CreatePaymentSession(PaymentDto paymentDto);
        public Task<string> Refund(RefundDto refundDto);
        Task UpdatePaymentAsync(string JsonRequest, string StripeHeader);
    }
}
