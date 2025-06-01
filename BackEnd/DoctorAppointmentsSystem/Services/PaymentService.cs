using Domain.Exceptions;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Services.Abstraction;
using Shared.Payment;
using Stripe;
using Stripe.Checkout;

namespace Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IServiceManager _serviceManager;

        private IConfiguration _configuration { get; }
        public UserManager<AppUser> _userManager { get; }
        private SessionService _sessionService { get; }
        public PaymentService(IConfiguration configuration, UserManager<AppUser> userManager, IServiceManager serviceManager)
        {
            _configuration = configuration;
            _userManager = userManager;
            _serviceManager = serviceManager;
            _sessionService = new SessionService();
        }


        public async Task<string> CreatePaymentSession(PaymentDto paymentDto)
        {
            var currentUser = await _userManager.FindByEmailAsync(paymentDto.Email) ?? throw new UnauthorizedAccessException("User Not-Found !!");

            //await _userManager.UpdateAsync(currentUser);

            var secretKey = _configuration.GetSection("StripeSetting")["SecretKey"];
            var domain = _configuration["FrontEnd:Url"];
            var amount = paymentDto.AmountOfMoney * 100;


            StripeConfiguration.ApiKey = secretKey;

            var options = new SessionCreateOptions()
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount =(long) amount, // The amount in the smallest currency unit (cents)
                            Currency = "usd",    // Adjust to the correct currency
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = paymentDto.Name, // Use the name from the PaymentDto
                                Description= paymentDto.Description // Use the description from the PaymentDto
                            }
                        },
                        Quantity = 1,

                    }
                },

                Mode = "payment",
                SuccessUrl = $"{domain}/payment-success",
                CancelUrl = $"{domain}/payment-cancel",
                CustomerEmail = paymentDto.Email,
                Metadata = new Dictionary<string, string>
                            {
                                { "email", paymentDto.Email },
                                { "patientId", paymentDto.PatientId.ToString() },
                                { "doctorReservationId", paymentDto.DoctorReservationId.ToString() }
                            }
            };


            Session session = await _sessionService.CreateAsync(options);
            return session.Url;
        }



        public async Task<string> Refund(RefundDto refundDto)
        {
            var secretKey = _configuration.GetSection("StripeSetting")["SecretKey"];
            StripeConfiguration.ApiKey = secretKey;

            //var sessionService = new SessionService();
            //var session = sessionService.Get(refundDto.PaymentId);

            var paymentIntentService = new PaymentIntentService();
            var paymentIntent = paymentIntentService.Get(refundDto.PaymentId);
            //var paymentIntent = paymentIntentService.Get(session.PaymentIntentId);


            if (paymentIntent == null)
            {
                throw new NotFoundException("Payment  not found.");
            }
            if (paymentIntent.Status != "succeeded")
            {
                throw new SingleValidationException("Payment is not completed.");
            }

            long totalAmount = paymentIntent.AmountReceived; // in cents
            long refundAmount = (long)(totalAmount * refundDto.Percent);

            var options = new RefundCreateOptions
            {
                PaymentIntent = paymentIntent.Id,
                Amount = refundAmount, // Convert to cents

                Metadata = new Dictionary<string, string>
                {
                    { "Id", refundDto.PaymentId }, // Assuming you want to store the payment ID in metadata
                    { "percent", refundDto.Percent.ToString() },
                    { "isPartial", refundDto.IsPartial.ToString() },

                }
            };
            var service = new RefundService();
            Refund refund = await service.CreateAsync(options);


            return refund.Id;  // Return the refund ID or any other relevant information

        }



        public async Task UpdatePaymentAsync(string JsonRequest, string StripeHeader)
        {
            string paymentId = string.Empty;
            string email = string.Empty;
            string emailFromSession = string.Empty;
            int patientId = default;
            int doctorReservationId = default;
            var endPointSecret = _configuration.GetSection("StripeSetting")["EndPointSecret"];

            var stripeEvent = EventUtility.ConstructEvent(JsonRequest,
                StripeHeader, endPointSecret);

            if (stripeEvent.Data.Object is Session session)
            {
                emailFromSession = session.CustomerEmail;
                patientId = int.Parse(session.Metadata["patientId"]);
                doctorReservationId = int.Parse(session.Metadata["doctorReservationId"]);
                paymentId = session.PaymentIntentId;
            }

            // Handle the event
            if (stripeEvent.Type == EventTypes.CheckoutSessionAsyncPaymentFailed)
            {
            }
            else if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
            {
                await _serviceManager.AppointmentOrchestrator.SaveAppointmentAsync(patientId, doctorReservationId, paymentId);
            }
            else if (stripeEvent.Type == EventTypes.CheckoutSessionExpired)
            {
            }
            else if (stripeEvent.Type == EventTypes.ChargeRefunded)
            {
            }
            else
            {
                Console.WriteLine("Unhandled event type: {0}", stripeEvent.Type);
            }
        }
    }
}