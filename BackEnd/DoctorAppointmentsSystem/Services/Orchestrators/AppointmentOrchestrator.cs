using Microsoft.Extensions.Configuration;
using Services.Abstraction;
using Services.Abstraction.Orchestrators;
using Shared.DTOs.DoctorReservation;
using Shared.DTOs.Email;

namespace Services.Orchestrators
{
    internal class AppointmentOrchestrator : IAppointmentOrchestrator
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IDoctorReservationService _doctorReservationService;
        private readonly ITransactionService _transactionService;
        private readonly IPaymentService _paymentService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AppointmentOrchestrator(IServiceManager serviceManager, IConfiguration configuration)
        {
            _appointmentService = serviceManager.AppointmentService;
            _doctorReservationService = serviceManager.DoctorReservationService;
            _transactionService = serviceManager.TransactionService;
            _paymentService = serviceManager.PaymentService;
            _emailService = serviceManager.EmailService;
            _configuration = configuration;
        }

        public async Task AddAppointmentAsync(int patientId, int doctorReservationId)
        {
            var doctor = await _doctorReservationService.GetDoctorByReservationId(doctorReservationId);
            // Pay Here
            await _transactionService.AddAsync(patientId, doctor.Id, doctor.Fees);
            await _appointmentService.AddAsync(patientId, doctorReservationId);
        }

        public async Task AddDoctorReservationAsync(NewResDTO reservation)
        {
            await _doctorReservationService.AddDoctorReservation(reservation);
        }

        public async Task CancelAppointmentAsync(int id)
        {
            var transactionId = await _appointmentService.GetTransactionId(id);
            await _transactionService.DeleteAsync(transactionId);

            await _appointmentService.DeleteAsync(id);

            var patient = await _appointmentService.GetPatientByAppointmentId(id);
            var email = new EmailDTO()
            {
                To = patient.Email,
                Template = MailTemplates.CancelAppointmentTemplate,
                Subject = "Appointment Canceled",
                Link = _configuration["BaseUrl"]
            };
            _emailService.SendEmail(email, $"{patient.FirstName} {patient.LastName}");
        }

        public async Task CancelReservationAsync(int id)
        {
            var appointments = await _doctorReservationService.GetAppointmentsByReservationId(id);

            if (appointments.Any())
                foreach (var appointment in appointments)
                    await CancelAppointmentAsync(appointment.Id);

            await _doctorReservationService.DeleteDoctorReservation(id);
        }
    }
}
