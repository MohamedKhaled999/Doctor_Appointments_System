﻿using Shared.DTOs.Appointment;
using Shared.DTOs.Doctor;
using Shared.DTOs.DoctorReservation;

namespace Services.Abstraction
{
    public interface IDoctorReservationService
    {
        Task<List<AppointmentReservationDTO>?> GetAppointmentsByReservationId(int id);
        bool IsVacantDay(DateOnly day, int doctorId);
        Task<DoctorFeesDTO> GetDoctorByReservationId(int id);
        Task EditDoctorReservation(NewResDTO res);
        Task DeleteDoctorReservation(int resId);
        Task AddDoctorReservation(NewResDTO res);
        Task<DoctorReservationDTO> GetDoctorReservationByID(int id);
        Task<List<DoctorReservationDTO>?> GetReservationsByDocID(int id);
        Task<DoctorReservationDTO?> GetLastReservationByDoctor(int doctorId);
        void GenerateCalendarReservation(int docId, int MaxRes);
    }
}
