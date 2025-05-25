using Services.Abstraction;
using Services.Abstraction.Orchestrators;
using Shared.DTOs.DoctorReservation;

namespace Services.Orchestrators
{
    internal class AppointmentOrchestrator : IAppointmentOrchestrator
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IDoctorReservationService _doctorReservationService;
        private readonly ITransactionService _transactionService;
        private readonly IPaymentService _paymentService;
        private readonly IEmailService _emailService;

        public AppointmentOrchestrator(IServiceManager serviceManager)
        {
            _appointmentService = serviceManager.AppointmentService;
            _doctorReservationService = serviceManager.DoctorReservationService;
            _transactionService = serviceManager.TransactionService;
            _paymentService = serviceManager.PaymentService;
            _emailService = serviceManager.EmailService;
        }

        public Task AddAppointmentAsync(int patientId, int doctorReservationId)
        {
            throw new NotImplementedException();
        }

        public Task AddDoctorReservationAsync(NewResDTO reservation)
        {
            throw new NotImplementedException();
        }

        public Task CancelAppointmentAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task CancelReservationAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
