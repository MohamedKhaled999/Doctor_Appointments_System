using Domain.Contracts;
using Domain.Exceptions;
using Domain.Models;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Services.Abstraction;
using Services.Abstraction.Notifications;
using Services.Abstraction.Orchestrators;
using Services.Specifications.Appointment;
using Shared.DTOs.Appointment;
using Shared.DTOs.DoctorReservation;
using Shared.DTOs.Email;
using Shared.DTOs.Patient;
using Shared.Enums;
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
        private readonly IUploadService _uploadService;
        private readonly INotificationService _notificationService;
        private readonly IReviewService _reviewService;
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
            _uploadService = serviceManager.UploadService;
            _notificationService = serviceManager.NotificationService;
            _reviewService = serviceManager.ReviewService;
            _configuration = configuration;
        }

        public async Task<List<DoctorReservationDTO>?> GetDoctorReservationsByAppUserIdAsync(int appUserId)
        {
            var doctor = await _doctorService.GetByAppUserIdAsync(appUserId);
            return await _doctorReservationService.GetReservationsByDocID(doctor.ID);
        }

        public async Task<List<AppointmentDTO>?> GetAppointmentsByAppUserIdAsync(int appUserId, int pageIndex, int pageSize)
        {
            var patient = await _patientService.GetByAppUserIdAsync(appUserId);
            return await _appointmentService.GetByPatientAsync(patient.Id, pageIndex, pageSize);
        }

        public async Task<string[]?> GetAppointmentDocuments(int appointmentId, int currentPatientAppUserId)
        {
            var patient = await _appointmentService.GetPatientByAppointmentId(appointmentId);
            if (currentPatientAppUserId != -1 && patient.AppUserId != currentPatientAppUserId)
                throw new UnAuthorizedException("Access Denied");

            var appointment = await _appointmentService.GetByIdAsync(appointmentId);
            if (appointment == null)
                throw new ArgumentNullException($"Appointment with ID {appointment} doesn't exist");

            if (appointment.DocumentUrls == null)
                return null;

            return appointment.DocumentUrls.Split("||");
        }

        public async Task<int> GetAppointmentCountByPatient(int appUserId)
        {
            var patient = await _patientService.GetByAppUserIdAsync(appUserId);
            return _appointmentService.GetCount(patient.Id);
        }

        public async Task<List<AppointmentReservationDTO>?> GetAppointmentsByReservationId(int reservationId, int appUserId)
        {
            var reservation = await _doctorReservationService.GetDoctorReservationByID(reservationId);
            var doctor = await _doctorService.GetByAppUserIdAsync(appUserId);
            if (reservation.DoctorID != doctor.ID)
                throw new UnAuthorizedException("Access Denied");

            return await _doctorReservationService.GetAppointmentsByReservationId(reservationId);
        }

        public async Task<string> CreatePaymentSessionAsync(int patientAppUserId, int doctorReservationId)
        {
            var reservation = await _doctorReservationService.GetDoctorReservationByID(doctorReservationId);
            if (reservation == null)
                throw new ArgumentNullException($"Reservation with ID {doctorReservationId} doesn't exist");
            if (!reservation.IsAvailable)
                throw new ValidationException(["Maximum Appointments Exceeded"]);
            if (reservation.EndTime < DateTime.Now)
                throw new ValidationException(["Reservation date has already passed"]);

            var doctor = await _doctorReservationService.GetDoctorByReservationId(doctorReservationId);
            var patient = await _patientService.GetByAppUserIdAsync(patientAppUserId);

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

        public async Task AddAppointmentDocuments(int appointmentId, IFormFile document, int currentPatientAppUserId)
        {
            var patient = await _appointmentService.GetPatientByAppointmentId(appointmentId);
            if (currentPatientAppUserId != -1 && patient.AppUserId != currentPatientAppUserId)
                throw new UnAuthorizedException("Access Denied");

            var appointment = await _appointmentService.GetWithDoctorAsync(appointmentId);
            if (appointment.StartTime < DateTime.Now)
                throw new ValidationException(["Appointment date has already passed"]);
            if (appointment == null)
                throw new ArgumentNullException($"Appointment with ID {appointment} doesn't exist");

            var documentUrl = await _uploadService.UploadFile(document);
            await _appointmentService.AddAppointmentDocument(appointmentId, documentUrl);
        }

        public async Task AddAppointmentPrescription(int reservationId, int appointmentId, IFormFile document, int currentDoctorAppUserId)
        {
            var reservation = await _doctorReservationService.GetDoctorReservationByID(reservationId);
            if (reservation == null)
                throw new ValidationException(["Reservation Not Found"]);
            if (reservation.StartTime > DateTime.Now)
                throw new ValidationException(["Reservation date hasn't passed yet"]);
            var doctor = await _doctorReservationService.GetDoctorByReservationId(reservationId);
            if (doctor.AppUserId != currentDoctorAppUserId)
                throw new UnAuthorizedException("Access Denied");

            var appointment = await _appointmentService.GetByIdAsync(appointmentId);
            if (appointment == null)
                throw new ArgumentNullException($"Appointment with ID {appointment} doesn't exist");
            if (appointment.DoctorReservationID != reservationId)
                throw new ValidationException(["Appointment doesn't belong to this reservation"]);

            var documentUrl = await _uploadService.UploadFile(document);
            await _appointmentService.AddAppointmentPrescription(appointmentId, documentUrl);
        }

        public async Task DeleteAppointmentDocument(int appointmentId, string documentUrl, int currentPatientAppUserId)
        {
            var patient = await _appointmentService.GetPatientByAppointmentId(appointmentId);
            if (currentPatientAppUserId != -1 && patient.AppUserId != currentPatientAppUserId)
                throw new UnAuthorizedException("Access Denied");

            var appointment = await _appointmentService.GetByIdAsync(appointmentId);
            if (appointment.StartTime < DateTime.Now)
                throw new ValidationException(["Appointment date has already passed"]);
            if (appointment == null)
                throw new ArgumentNullException($"Appointment with ID {appointment} doesn't exist");

            if (!_uploadService.Delete(documentUrl))
                throw new NotFoundException($"Document {documentUrl} doesn't exist");

            await _appointmentService.DeleteAppointmentDocument(appointmentId, documentUrl);
        }

        public async Task DeleteAppointmentPrescription(int appointmentId, int reservationId, int currentDoctorAppUserId)
        {
            var reservation = await _doctorReservationService.GetDoctorReservationByID(reservationId);
            if (reservation == null)
                throw new ValidationException(["Reservation Not Found"]);
            if (reservation.EndTime > DateTime.Now)
                throw new ValidationException(["Reservation date hasn't passed yet"]);
            var doctor = await _doctorReservationService.GetDoctorByReservationId(reservationId);
            if (doctor.AppUserId != currentDoctorAppUserId)
                throw new UnAuthorizedException("Access Denied");

            var appointment = await _appointmentService.GetByIdAsync(appointmentId);
            if (appointment == null)
                throw new ArgumentNullException($"Appointment with ID {appointment} doesn't exist");
            if (appointment.DoctorReservationID != reservationId)
                throw new ValidationException(["Appointment doesn't belong to this reservation"]);

            if (appointment.PrescriptionUrl == null)
                throw new NotFoundException($"Prescription doesn't exist");

            if (!_uploadService.Delete(appointment.PrescriptionUrl))
                throw new ArgumentNullException("Failed To Delete Prescription");
            await _appointmentService.DeleteAppointmentPrescription(appointmentId);
        }

        public async Task AddReview(AddReviewDTO review, int appUserId)
        {
            var doctor = await _doctorReservationService.GetDoctorByReservationId(review.DoctorReservationId);
            var patient = await _patientService.GetByAppUserIdAsync(appUserId);
            var appointments = await _appointmentService.GetByPatientAndDoctorAsync(patient.Id, doctor.Id);
            if (!appointments.Any(a => a.StartTime < DateTime.Now && a.Canceled == false))
                throw new ValidationException(["You don't have any completed appointment with this doctor"]);

            var existingReviewId = await _reviewService.GetReviewByPatientAndDoctor(patient.Id, doctor.Id);
            if (existingReviewId != null)
                await _reviewService.DeleteReview(existingReviewId.Value);

            await _reviewService.AddReview(review, patient.Id, doctor.Id);
        }

        public async Task SaveAppointmentAsync(int patientId, int doctorReservationId, string paymentId)
        {
            var doctor = await _doctorReservationService.GetDoctorByReservationId(doctorReservationId);
            await _transactionService.AddAsync(patientId, doctor.Id, doctor.Fees, paymentId);

            var transactionId = await _transactionService.GetByPaymentId(paymentId);
            await _appointmentService.AddAsync(patientId, doctorReservationId, transactionId);

            var appointment = await _appointmentService.GetLastAppointmentByPatientAsync(patientId);
            var patient = await _appointmentService.GetPatientByAppointmentId(appointment.Id);
            var patientNotification = new NotificationMessage()
            {
                EventType = NotificationEvents.Patient_AppointmentAdded,
                Message = $"Appointment with Dr. {appointment.Doctor} on {appointment.StartTime} has been added."
            };
            await _notificationService.SendNotification(patient.AppUserId, patientNotification);

            var jobId = BackgroundJob.Schedule(
                () => AppointmentReminderJob(patient.AppUserId, appointment.Doctor),
                    appointment.StartTime.AddHours(-3) - DateTime.Now
                );
            await _appointmentService.AddJobIdAsync(appointment.Id, jobId);

            var reservation = await _doctorReservationService.GetDoctorReservationByID(doctorReservationId);
            if (!reservation.IsAvailable)
            {
                var doctorNotification = new NotificationMessage()
                {
                    EventType = NotificationEvents.Doctor_MaximumAppointmentsReached,
                    Message = $"Reservation on {reservation.StartTime} has reached maximum number of appointments."
                };
                await _notificationService.SendNotification(doctor.AppUserId, doctorNotification);
            }
        }

        public async Task<DoctorReservationDTO> AddDoctorReservationAsync(NewResDTO reservation, int appUserId)
        {
            if (reservation.Date <= DateTime.Now || reservation.Date - DateTime.Now >= TimeSpan.FromDays(14))
                throw new ValidationException(["Can't add reservation on this day"]);
            if (reservation.EndTime - reservation.StartTime < TimeSpan.FromMinutes(30))
                throw new ValidationException(["End time must be after start time by 30 minutes at minimum"]);

            var doctor = await _doctorService.GetByAppUserIdAsync(appUserId);
            if (doctor.ID != reservation.DoctorID)
                throw new UnAuthorizedException("Access Denied");

            DoctorReservationDTO newReservation;
            if (reservation.ResID == 0)
            {
                await _doctorReservationService.AddDoctorReservation(reservation);

                newReservation = await _doctorReservationService.GetLastReservationByDoctor(reservation.DoctorID);
                var notification = new NotificationMessage()
                {
                    EventType = NotificationEvents.Doctor_ReservationAdded,
                    Message = $"Reservation on {newReservation.StartTime} has been added."
                };
                await _notificationService.SendNotification(appUserId, notification);
            }

            else
            {
                await _doctorReservationService.EditDoctorReservation(reservation);
                newReservation = await _doctorReservationService.GetDoctorReservationByID(reservation.ResID);

                var appointments = await _doctorReservationService.GetAppointmentsByReservationId(newReservation.Id);
                if (appointments != null)
                    foreach (var appointment in appointments)
                        await RescheduleAppointment(appointment.Id);
            }

            return newReservation;
        }

        public async Task CancelAppointmentAsync(int id, int currentPatientAppUserId = -1)
        {
            var patient = await _appointmentService.GetPatientByAppointmentId(id);
            if (currentPatientAppUserId != -1 && patient.AppUserId != currentPatientAppUserId)
                throw new UnAuthorizedException("Access Denied");
            if (await _appointmentService.IsCanceledAsync(id))
                throw new ValidationException(["Appointment has already been canceled"]);

            var appointment = await _appointmentService.GetWithDoctorAsync(id);
            if (appointment == null)
                throw new ArgumentNullException($"Appointment with ID {id} doesn't exist");
            if (appointment.StartTime.Date < DateTime.Now)
                throw new ValidationException(["Appointment date has already passed"]);

            var remainingTime = appointment.StartTime - DateTime.Now;
            if (remainingTime < TimeSpan.FromHours(12))
                throw new ValidationException(["Can't cancel appointment (less than 12 hours remaining)"]);

            var transactionId = await _appointmentService.GetTransactionId(id);

            if (remainingTime >= TimeSpan.FromHours(12) && remainingTime < TimeSpan.FromHours(24))
                await CancelAsync(id, transactionId, 0.5F);

            else if (remainingTime >= TimeSpan.FromHours(24) && remainingTime < TimeSpan.FromHours(48))
                await CancelAsync(id, transactionId, 0.75F);

            else
                await CancelAsync(id, transactionId, 1F);

            var email = new EmailDTO()
            {
                To = patient.Email,
                Template = MailTemplates.CancelAppointmentTemplate,
                Subject = "Appointment Canceled",
                Link = _configuration["FrontEnd:Url"],
            };
            _emailService.SendEmail(email, $"{patient.FirstName} {patient.LastName}", appointment.StartTime.Date, remainingTime >= TimeSpan.FromHours(48));

            var notification = new NotificationMessage()
            {
                EventType = NotificationEvents.Patient_AppointmentCanceled,
                Message = $"Appointment with Dr. {appointment.Doctor} on {appointment.StartTime} has been canceled."
            };
            await _notificationService.SendNotification(patient.AppUserId, notification);
        }

        public async Task CancelReservationAsync(int id, int currentDoctorAppUserId)
        {
            var reservation = await _doctorReservationService.GetDoctorReservationByID(id);
            if (reservation == null)
                throw new ValidationException(["Reservation Not Found"]);
            var doctor = await _doctorReservationService.GetDoctorByReservationId(id);
            if (doctor.AppUserId != currentDoctorAppUserId)
                throw new UnAuthorizedException("Access Denied");
            if (reservation.StartTime < DateTime.Now)
                throw new ValidationException(["Reservation date has already passed"]);
            if (reservation.StartTime - DateTime.Now < TimeSpan.FromDays(2))
                throw new ValidationException(["Can't cancel reservation (less than 48 hours left)"]);

            var appointments = await _doctorReservationService.GetAppointmentsByReservationId(id);

            if (appointments.Any())
                foreach (var appointment in appointments)
                    await CancelAppointmentAsync(appointment.Id);

            await _doctorReservationService.DeleteDoctorReservation(id);

            var notification = new NotificationMessage()
            {
                EventType = NotificationEvents.Doctor_ReservationCanceled,
                Message = $"Reservation on {reservation.StartTime} {((appointments.Count > 0) ? $"with {appointments.Count} associated appointment(s)" : "")} has been canceled."
            };
            await _notificationService.SendNotification(currentDoctorAppUserId, notification);
        }

        public void AppointmentReminderJob(int appUserId, string doctorName)
        {
            var patientReminder = new NotificationMessage()
            {
                EventType = NotificationEvents.Patient_AppointmentReminder,
                Message = $"Reminder: you have an appointment with Dr. {doctorName} after 3 hours."
            };
            _notificationService.SendNotification(appUserId, patientReminder).Wait();
        }

        private async Task CancelAsync(int appointmentId, int transactionId, float percent = 1F)
        {
            var refundDto = new RefundDto()
            {
                PaymentId = await _transactionService.GetPaymentId(transactionId),
                Percent = percent,
                IsPartial = percent < 1F
            };
            await _paymentService.Refund(refundDto);

            var jobId = await _appointmentService.GetJobIdAsync(appointmentId);
            if (jobId != null)
                BackgroundJob.Delete(jobId);

            if (!refundDto.IsPartial)
            {
                await _appointmentService.DeleteAsync(appointmentId);
                await _transactionService.DeleteAsync(transactionId);
            }
            else
            {
                var transaction = await _transactionService.GetByIdAsync(transactionId);
                await _transactionService.UpdateAsync(transactionId, transaction.Amount * percent);
                await _appointmentService.SetCanceledAsync(appointmentId);
            }
        }

        private async Task RescheduleAppointment(int appointmentId)
        {
            var patient = await _appointmentService.GetPatientByAppointmentId(appointmentId);
            var appointment = await _appointmentService.GetWithDoctorAsync(appointmentId);

            var patientNotification = new NotificationMessage()
            {
                EventType = NotificationEvents.Patient_AppointmentRescheduled,
                Message = $"Appointment with Dr. {appointment.Doctor} has been rescheduled to {appointment.StartTime}."
            };
            await _notificationService.SendNotification(patient.AppUserId, patientNotification);

            var email = new EmailDTO()
            {
                To = patient.Email,
                Template = MailTemplates.CancelAppointmentTemplate,
                Subject = "Appointment Rescheduled",
                Link = _configuration["FrontEnd:Url"],
            };
            _emailService.SendEmail(email, $"{patient.FirstName} {patient.LastName}", appointment.StartTime.Date);

            var jobId = await _appointmentService.GetJobIdAsync(appointmentId);
            if (jobId != null)
                BackgroundJob.Delete(jobId);
            jobId = BackgroundJob.Schedule(
            () => AppointmentReminderJob(patient.AppUserId, appointment.Doctor),
                appointment.StartTime.AddHours(-3) - DateTime.Now
            );
            await _appointmentService.AddJobIdAsync(appointment.Id, jobId);
        }
    }
}
