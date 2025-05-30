using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;

namespace Presentation.Controllers
{
    public class PaymentController(IServiceManager serviceManager) : ApiController
    {
        //[HttpPost("payment-session")]
        //[Authorize(Roles = "patient")]
        //public async Task<IActionResult> CreatePaymentSession([FromBody] PaymentDto paymentDto)
        //{
        //    var url = await serviceManager.PaymentService.CreatePaymentSession(paymentDto);
        //    return Ok(new { Url = url });
        //}

        //[HttpPost("refund")]
        //[Authorize(Roles = "patient")]
        //public async Task<IActionResult> RefundPayment([FromBody] RefundDto refundDto)
        //{
        //    var refundId = await serviceManager.PaymentService.Refund(refundDto);
        //    return Ok(new { RefundId = refundId });
        //}

        // webhook 
        [HttpPost("webhook")]
        public async Task<IActionResult> WebHook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            await serviceManager.PaymentService.UpdatePaymentAsync(json,
                Request.Headers["Stripe-Signature"]!);
            return new EmptyResult();
        }
    }
}
