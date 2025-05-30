using Shared.DTOs.DoctorReservation;

namespace Services.Abstraction.Orchestrators
{
    public interface IAppointmentOrchestrator
    {
        Task<string> CreatePaymentSessionAsync(int patientId, int doctorReservationId);
        Task SaveAppointmentAsync(int patientId, int doctorReservationId, string paymentId);
        Task AddDoctorReservationAsync(NewResDTO reservation);
        Task CancelAppointmentAsync(int id, int currentPatientId);
        Task CancelReservationAsync(int id, int currentDoctorId);
    }
}
