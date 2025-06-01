using Shared.DTOs.Appointment;
using Shared.DTOs.Patient;

namespace Services.Abstraction
{
    public interface IAppointmentService
    {
        Task<AppointmentDTO?> GetByIdAsync(int id);
        Task<int> GetTransactionId(int appointmentId);
        Task<PatientAppUserDTO> GetPatientByAppointmentId(int id);
        Task<List<AppointmentDTO>?> GetByPatientAsync(int patientId, int pageIndex, int pageSize);
        public int GetCount();
        Task AddAsync(int patientId, int doctorReservationId, int transactionId);
        Task DeleteAsync(int id);
    }
}
