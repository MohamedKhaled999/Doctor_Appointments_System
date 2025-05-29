using Microsoft.AspNetCore.Mvc;
using Shared.Payment;

namespace Presentation.Controllers
{
    public class PaymentController : ApiController
    {

        [HttpPost("payment-session")]
        public async Task<IActionResult> CreatePaymentSession([FromBody] PaymentDto paymentDto)
        {


            var sessionId = await _paymentService.CreatePaymentSession(paymentDto);
            return Ok(new { SessionId = sessionId });

        }

        //refund
        [HttpPost("refund")]
        public async Task<IActionResult> RefundPayment([FromBody] RefundDto refundDto)
        {

            var refundId = await _paymentService.RefundPayment(refundDto);
            return Ok(new { RefundId = refundId });

        }
    }
}
