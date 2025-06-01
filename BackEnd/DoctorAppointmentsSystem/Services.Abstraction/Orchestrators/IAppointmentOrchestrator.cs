using Microsoft.AspNetCore.Http;
using Shared.DTOs.Appointment;
using Shared.DTOs.DoctorReservation;

namespace Services.Abstraction.Orchestrators
{
    public interface IAppointmentOrchestrator
    {
        Task<List<DoctorReservationDTO>> GetDoctorReservationsByAppUserIdAsync(int appUserId);
        Task<List<AppointmentDTO>?> GetAppointmentsByAppUserIdAsync(int appUserId, int pageIndex, int pageSize);
        Task<string[]?> GetAppointmentDocuments(int appointmentId);
        Task<string> CreatePaymentSessionAsync(int patientAppUserId, int doctorReservationId);
        Task AddAppointmentDocuments(int appointmentId, params IFormFile[] docs);
        Task SaveAppointmentAsync(int patientId, int doctorReservationId, string paymentId);
        Task AddDoctorReservationAsync(NewResDTO reservation, int appUserId);
        Task CancelAppointmentAsync(int id, int currentPatientAppUserId);
        Task CancelReservationAsync(int id, int currentDoctorAppUserId);
    }
}
