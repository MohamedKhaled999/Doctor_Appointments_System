using Domain.Exceptions;
using Microsoft.Extensions.Configuration;
using Services.Abstraction;
using Services.Abstraction.Orchestrators;
using Shared.DTOs.DoctorReservation;
using Shared.DTOs.Email;
using Shared.Payment;

namespace Services.Orchestrators
{
    internal class AppointmentOrchestrator : IAppointmentOrchestrator
    {
        private readonly IPatientService _patientService;
        private readonly IAppointmentService _appointmentService;
        private readonly IDoctorReservationService _doctorReservationService;
        private readonly ITransactionService _transactionService;
        private readonly IPaymentService _paymentService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AppointmentOrchestrator(IServiceManager serviceManager, IConfiguration configuration)
        {
            _patientService = serviceManager.PatientService;
            _appointmentService = serviceManager.AppointmentService;
            _doctorReservationService = serviceManager.DoctorReservationService;
            _transactionService = serviceManager.TransactionService;
            _paymentService = serviceManager.PaymentService;
            _emailService = serviceManager.EmailService;
            _configuration = configuration;
        }

        public async Task<string> CreatePaymentSessionAsync(int patientId, int doctorReservationId)
        {
            var doctor = await _doctorReservationService.GetDoctorByReservationId(doctorReservationId);
            var patient = await _patientService.GetByIdAsync(patientId, patientId);
            var paymentDto = new PaymentDto()
            {
                AmountOfMoney = doctor.Fees,
                Description = $"Appointment with Dr.{doctor.FirstName} {doctor.LastName}",
                Email = patient.Email
            };
            var paymentUrl = await _paymentService.CreatePaymentSession(paymentDto);
            return paymentUrl;
        }

        public async Task SaveAppointmentAsync(int patientId, int doctorReservationId)
        {
            var doctor = await _doctorReservationService.GetDoctorByReservationId(doctorReservationId);
            await _transactionService.AddAsync(patientId, doctor.Id, doctor.Fees);
            await _appointmentService.AddAsync(patientId, doctorReservationId);
        }

        public async Task AddDoctorReservationAsync(NewResDTO reservation)
        {
            await _doctorReservationService.AddDoctorReservation(reservation);
        }

        public async Task CancelAppointmentAsync(int id, int currentPatientId = -1)
        {
            var patient = await _appointmentService.GetPatientByAppointmentId(id);
            if (currentPatientId != -1 && patient.Id != currentPatientId)
                throw new UnAuthorizedException("Access Denied");

            var transactionId = await _appointmentService.GetTransactionId(id);
            await _transactionService.DeleteAsync(transactionId);

            // Refund Here

            await _appointmentService.DeleteAsync(id);

            var email = new EmailDTO()
            {
                To = patient.Email,
                Template = MailTemplates.CancelAppointmentTemplate,
                Subject = "Appointment Canceled",
                Link = _configuration["FrontEnd:Url"]
            };
            _emailService.SendEmail(email, $"{patient.FirstName} {patient.LastName}");
        }

        public async Task CancelReservationAsync(int id, int currentDoctorId)
        {
            var doctor = _doctorReservationService.GetDoctorByReservationId(id);
            if (doctor.Id != currentDoctorId)
                throw new UnAuthorizedException("Access Denied");

            var appointments = await _doctorReservationService.GetAppointmentsByReservationId(id);

            if (appointments.Any())
                foreach (var appointment in appointments)
                    await CancelAppointmentAsync(appointment.Id);

            await _doctorReservationService.DeleteDoctorReservation(id);
        }
    }
}
