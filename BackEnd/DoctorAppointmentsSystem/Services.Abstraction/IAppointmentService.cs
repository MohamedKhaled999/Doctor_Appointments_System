using Shared.DTOs.Appointment;
using Shared.Enums;

namespace Services.Abstraction
{
    public interface IAppointmentService
    {
        Task<bool> IsReservationFull(int doctorReservationId);
        Task DeleteAppointmentAsync(int appointmentId);
        Task<AppointmentCreationStatus> AddAppointment(int patientId, int doctorReservationId);
        void UpdateAppointment(AppointmentDTO appointment);
        Task<AppointmentDTO> GetAppointmentById(int appointmentId);
        Task<List<AppointmentDTO>> GetDoctorAppointments(int doctorId, int reservationId);
        Task<List<AppointmentDTO>> GetPatientAppointments(int patientId, string? specialtyName = null, string? doctorName = null);
        Task<int> GetAppointmentsCountByDate(int doctorID, DateTime? date);
        Task<int?> GetReservationId(int appointmentId);
        Task<List<AppointmentDTO>> GetAppointmentsByReservationId(int reservationId);
    }
}
