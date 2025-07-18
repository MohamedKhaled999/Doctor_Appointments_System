﻿using System.Linq.Expressions;
using System.Reflection.Metadata;
using Shared.DTOs.Appointment;
using Shared.DTOs.Patient;

namespace Services.Abstraction
{
    public interface IAppointmentService
    {
        Task<AppointmentDTO?> GetByIdAsync(int id);
        Task<List<AppointmentDTO>?> GetByPatientAndDoctorAsync(int patientId, int doctorId);
        Task<AppointmentDTO?> GetWithDoctorAsync(int id);
        Task<AppointmentDTO?> GetLastAppointmentByPatientAsync(int patientId);
        Task<int> GetTransactionId(int appointmentId);
        Task AddAppointmentDocument(int appointmentId, string documentUrl);
        Task AddAppointmentPrescription(int appointmentId, string documentUrl);
        Task DeleteAppointmentDocument(int appointmentId, string prescriptionUrl);
        Task DeleteAppointmentPrescription(int appointmentId);
        Task<PatientAppUserDTO> GetPatientByAppointmentId(int id);
        Task AddJobIdAsync(int appointmentId, string jobId);
        Task<string?> GetJobIdAsync(int id);
        Task<bool> IsCanceledAsync(int id);
        Task<List<AppointmentDTO>?> GetByPatientAsync(int patientId, int pageIndex, int pageSize);
        public int GetCount(int patientId);
        public int GetDoctorAppointmentsCount(int doctorId);
        Task AddAsync(int patientId, int doctorReservationId, int transactionId);
        Task DeleteAsync(int id);
        Task SetCanceledAsync(int id);
    }
}
