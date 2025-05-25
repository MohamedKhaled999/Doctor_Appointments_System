using AutoMapper;
using Domain.Contracts;
using Domain.Models;
using Services.Abstraction;
using Services.Specifications.Appointment;
using Shared.DTOs.Appointment;

namespace Services
{
    internal class AppointmentService : IAppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AppointmentService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        public async Task<List<AppointmentDTO>?> GetByPatientAsync(int patientId, int pageIndex = 1, int pageSize = 20)
        {
            var specs = new AppointmentPatientSpecifications(a => a.PatientId == patientId, pageIndex, pageSize);
            var appointments = await _unitOfWork.GetRepository<Appointment, int>().GetAllAsync(specs);
            if (appointments == null)
                return null;
            return appointments.Select(_mapper.Map<AppointmentDTO>).ToList();
        }

        public int GetCount()
            => _unitOfWork.GetRepository<Appointment, int>().GetCount();

        public async Task AddAsync(int patientId, int doctorReservationId)
        {
            var appointment = new Appointment()
            {
                PatientId = patientId,
                DoctorReservationID = doctorReservationId
            };
            await _unitOfWork.GetRepository<Appointment, int>().AddAsync(appointment);
        }

        public async Task DeleteAsync(int id)
        {
            var appointment = await _unitOfWork.GetRepository<Appointment, int>().GetByIdAsync(id);
            if (appointment == null)
                throw new ArgumentNullException($"Appointment with ID {id} doesn't exist");
            _unitOfWork.GetRepository<Appointment, int>().Delete(appointment);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
