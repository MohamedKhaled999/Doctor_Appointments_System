using Shared.DTOs.DoctorReservation;

namespace Services.Abstraction
{
    public interface IDoctorReservationService
    {
        Task EditDoctorReservation(NewResDTO res);
        Task DeleteDoctorReservation(int resId);
        Task AddDoctorReservation(NewResDTO res);
        Task<DoctorReservationDTO> GetDoctorReservationByID(int id);
        Task<List<DoctorReservationDTO>> GetReservationsByDocID(int id);
        void GenerateCalendarReservation(int docId, int MaxRes);
    }
}
