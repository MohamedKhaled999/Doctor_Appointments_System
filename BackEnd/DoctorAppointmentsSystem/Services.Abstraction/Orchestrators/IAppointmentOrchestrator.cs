using Shared.DTOs.DoctorReservation;

namespace Services.Abstraction.Orchestrators
{
    public interface IAppointmentOrchestrator
    {
        Task AddAppointmentAsync(int patientId, int doctorReservationId);
        Task AddDoctorReservationAsync(NewResDTO reservation);
        Task CancelAppointmentAsync(int id, int currentPatientId);
        Task CancelReservationAsync(int id, int currentDoctorId);
    }
}
