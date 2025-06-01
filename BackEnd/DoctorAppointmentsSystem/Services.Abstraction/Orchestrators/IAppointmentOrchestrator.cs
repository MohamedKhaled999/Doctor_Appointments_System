using Shared.DTOs.Appointment;
using Shared.DTOs.DoctorReservation;

namespace Services.Abstraction.Orchestrators
{
    public interface IAppointmentOrchestrator
    {
        Task<List<DoctorReservationDTO>> GetDoctorReservationsByAppUserIdAsync(int appUserId);
        Task<List<AppointmentDTO>?> GetAppointmentsByAppUserIdAsync(int appUserId, int pageIndex, int pageSize);
        Task<string> CreatePaymentSessionAsync(int patientAppUserId, int doctorReservationId);
        Task SaveAppointmentAsync(int patientId, int doctorReservationId, string paymentId);
        Task AddDoctorReservationAsync(NewResDTO reservation);
        Task CancelAppointmentAsync(int id, int currentPatientAppUserId);
        Task CancelReservationAsync(int id, int currentDoctorAppUserId);
    }
}
