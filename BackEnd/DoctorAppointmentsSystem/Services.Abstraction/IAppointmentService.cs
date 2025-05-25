using Shared.DTOs.Appointment;
using Shared.DTOs.Patient;

namespace Services.Abstraction
{
    public interface IAppointmentService
    {
        Task<int> GetTransactionId(int appointmentId);
        Task<PatientDTO> GetPatientByAppointmentId(int id);
        Task<List<AppointmentDTO>?> GetByPatientAsync(int patientId, int pageIndex, int pageSize);
        public int GetCount();
        Task AddAsync(int patientId, int doctorReservationId);
        Task DeleteAsync(int id);
    }
}
