using AutoMapper;
using Domain.Contracts;
using Domain.Models;
using Domain.Specifications;
using Services.Abstraction;
using Shared.DTOs.Appointment;

namespace Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AppointmentService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        public async Task<List<AppointmentDTO>?> GetByPatient(int patientId)
        {
            var appointments = await _unitOfWork.GetRepository<Appointment, int>().GetAllAsync(new AppointmentPatientSpecifications(a => a.PatientId == patientId));
            if (appointments == null)
                return null;
            return appointments.Select(_mapper.Map<AppointmentDTO>).ToList();
        }

        public async Task Add(int patientId, int doctorReservationId)
        {
            var isOrderPaid = true; // Check Payment Status Before Adding Appointment
            if (isOrderPaid)
            {
                var appointment = new Appointment()
                {
                    PatientId = patientId,
                    DoctorReservationID = doctorReservationId
                };
                await _unitOfWork.GetRepository<Appointment, int>().AddAsync(appointment);
            }
            else
            {
                // Delete Order Here
            }
        }

        public async Task Delete(int id)
        {
            // ============ Delete Order Before Deleting Appointment ============
            var appointment = await _unitOfWork.GetRepository<Appointment, int>().GetByIdAsync(id);
            if (appointment == null)
                throw new ArgumentNullException($"Appointment with ID {id} doesn't exist");
            _unitOfWork.GetRepository<Appointment, int>().Delete(appointment);
        }
    }
}
