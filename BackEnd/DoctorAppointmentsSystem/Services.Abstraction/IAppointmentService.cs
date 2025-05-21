using Shared.DTOs.Appointment;

namespace Services.Abstraction
{
    public interface IAppointmentService
    {
        Task<List<AppointmentDTO>?> GetByPatient(int patientId);
        Task Add(int patientId, int doctorReservationId);
        Task Delete(int id);
    }
}
