using Domain.Exceptions;
using Microsoft.Extensions.Configuration;
using Services.Abstraction;
using Services.Abstraction.Orchestrators;
using Shared.DTOs.Appointment;
using Shared.DTOs.DoctorReservation;
using Shared.DTOs.Email;
using Shared.Payment;

namespace Services.Orchestrators
{
    internal class AppointmentOrchestrator : IAppointmentOrchestrator
    {
        private readonly IPatientService _patientService;
        private readonly IDoctorService _doctorService;
        private readonly IAppointmentService _appointmentService;
        private readonly IDoctorReservationService _doctorReservationService;
        private readonly ITransactionService _transactionService;
        private readonly IPaymentService _paymentService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AppointmentOrchestrator(IServiceManager serviceManager, IConfiguration configuration)
        {
            _patientService = serviceManager.PatientService;
            _doctorService = serviceManager.DoctorService;
            _appointmentService = serviceManager.AppointmentService;
            _doctorReservationService = serviceManager.DoctorReservationService;
            _transactionService = serviceManager.TransactionService;
            _paymentService = serviceManager.PaymentService;
            _emailService = serviceManager.EmailService;
            _configuration = configuration;
        }

        public async Task<List<DoctorReservationDTO>> GetDoctorReservationsByAppUserIdAsync(int appUserId)
        {
            var doctor = await _doctorService.GetByAppUserIdAsync(appUserId);
            return await _doctorReservationService.GetReservationsByDocID(doctor.ID);
        }

        public async Task<List<AppointmentDTO>?> GetAppointmentsByAppUserIdAsync(int appUserId, int pageIndex, int pageSize)
        {
            var patient = await _patientService.GetByAppUserIdAsync(appUserId);
            return await _appointmentService.GetByPatientAsync(patient.Id, pageIndex, pageSize);
        }

        public async Task<string> CreatePaymentSessionAsync(int patientAppUserId, int doctorReservationId)
        {
            var doctor = await _doctorReservationService.GetDoctorByReservationId(doctorReservationId);
            var patient = await _patientService.GetByAppUserIdAsync(patientAppUserId);
            if (doctor == null)
                throw new ArgumentNullException($"Reservation with ID {doctorReservationId} doesn't exist");

            var paymentDto = new PaymentDto()
            {
                PatientId = patient.Id,
                DoctorReservationId = doctorReservationId,
                AmountOfMoney = doctor.Fees,
                Description = $"Appointment with Dr. {doctor.FirstName} {doctor.LastName}",
                Email = patient.Email
            };
            var paymentUrl = await _paymentService.CreatePaymentSession(paymentDto);
            return paymentUrl;
        }

        public async Task SaveAppointmentAsync(int patientId, int doctorReservationId, string paymentId)
        {
            var doctor = await _doctorReservationService.GetDoctorByReservationId(doctorReservationId);
            await _transactionService.AddAsync(patientId, doctor.Id, doctor.Fees, paymentId);
            var transactionId = await _transactionService.GetByPaymentId(paymentId);
            await _appointmentService.AddAsync(patientId, doctorReservationId, transactionId.Value);
        }

        public async Task AddDoctorReservationAsync(NewResDTO reservation, int appUserId)
        {
            var doctor = await _doctorService.GetByAppUserIdAsync(appUserId);
            if (doctor.ID != reservation.DoctorID)
                throw new UnAuthorizedException("Access Denied");
            await _doctorReservationService.AddDoctorReservation(reservation);
        }

        public async Task CancelAppointmentAsync(int id, int currentPatientAppUserId = -1)
        {
            var patient = await _appointmentService.GetPatientByAppointmentId(id);
            if (currentPatientAppUserId != -1 && patient.AppUserId != currentPatientAppUserId)
                throw new UnAuthorizedException("Access Denied");
            var appointmentDate = (await _appointmentService.GetByIdAsync(id)).StartTime.Date;

            var transactionId = await _appointmentService.GetTransactionId(id);

            var refundDto = new RefundDto()
            {
                PaymentId = await _transactionService.GetPaymentId(transactionId)
            };
            await _paymentService.Refund(refundDto);

            await _appointmentService.DeleteAsync(id);

            await _transactionService.DeleteAsync(transactionId);

            var email = new EmailDTO()
            {
                To = patient.Email,
                Template = MailTemplates.CancelAppointmentTemplate,
                Subject = "Appointment Canceled",
                Link = _configuration["FrontEnd:Url"],
            };
            _emailService.SendEmail(email, $"{patient.FirstName} {patient.LastName}", appointmentDate);
        }

        public async Task CancelReservationAsync(int id, int currentDoctorAppUserId)
        {
            var doctor = await _doctorReservationService.GetDoctorByReservationId(id);
            if (doctor.AppUserId != currentDoctorAppUserId)
                throw new UnAuthorizedException("Access Denied");

            var appointments = await _doctorReservationService.GetAppointmentsByReservationId(id);

            if (appointments.Any())
                foreach (var appointment in appointments)
                    await CancelAppointmentAsync(appointment.Id);

            await _doctorReservationService.DeleteDoctorReservation(id);
        }
    }
}
