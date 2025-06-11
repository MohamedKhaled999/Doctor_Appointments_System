using Microsoft.AspNetCore.Http;
using Shared.DTOs.Appointment;
using Shared.DTOs.DoctorReservation;
using Shared.DTOs.Patient;

namespace Services.Abstraction.Orchestrators
{
    public interface IAppointmentOrchestrator
    {
        Task<List<DoctorReservationDTO>?> GetDoctorReservationsByAppUserIdAsync(int appUserId);
        Task<List<AppointmentDTO>?> GetAppointmentsByAppUserIdAsync(int appUserId, int pageIndex, int pageSize);
        Task<string[]?> GetAppointmentDocuments(int appointmentId, int currentPatientAppUserId);
        Task<int> GetAppointmentCountByPatient(int appUserId);
        Task<List<AppointmentReservationDTO>?> GetAppointmentsByReservationId(int reservationId, int appUserId);
        Task<string> CreatePaymentSessionAsync(int patientAppUserId, int doctorReservationId);
        Task AddAppointmentDocuments(int appointmentId, IFormFile document, int currentPatientAppUserId);
        Task AddAppointmentPrescription(int reservationId, int appointmentId, IFormFile document, int currentDoctorAppUserId);
        Task DeleteAppointmentDocument(int appointmentId, string documentUrl, int currentPatientAppUserId);
        Task DeleteAppointmentPrescription(int appointmentId, int reservationId, int currentDoctorAppUserId);
        Task AddReview(AddReviewDTO review, int appUserId);
        Task SaveAppointmentAsync(int patientId, int doctorReservationId, string paymentId);
        Task<DoctorReservationDTO> AddDoctorReservationAsync(NewResDTO reservation, int appUserId);
        Task CancelAppointmentAsync(int id, int currentPatientAppUserId = -1);
        Task CancelReservationAsync(int id, int currentDoctorAppUserId);
    }
}
