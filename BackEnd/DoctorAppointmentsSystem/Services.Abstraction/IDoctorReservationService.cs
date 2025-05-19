namespace Services.Abstraction
{
    public interface IDoctorReservationService
    {
        void EditDoctorReservation(DoctorReservation res);
        void DeleteDoctorReservation(DoctorReservation res);
        void AddDoctorReservation(DoctorReservation res);
        Task<DoctorReservation> GetDoctorReservationByID(int id);
        Task<List<DoctorReservation>> GetReservationsByDocID(int id);
        void GenerateCalendarReservation(Doctor doc, int MaxRes);
    }
}
