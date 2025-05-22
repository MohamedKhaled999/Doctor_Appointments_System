using Shared.DTOs.Appointment;

namespace Services.Abstraction
{
    public interface IAppointmentService
    {
        Task<List<AppointmentDTO>?> GetByPatientAsync(int patientId, int pageIndex, int pageSize);
        public int GetCount();
        Task AddAsync(int patientId, int doctorReservationId);
        Task DeleteAsync(int id);
    }
}
