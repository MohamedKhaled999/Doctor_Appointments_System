using AutoMapper;
using Domain.Contracts;
using Domain.Models;
using Services.Abstraction;
using Services.Specifications.Appointment;
using Shared.DTOs.Appointment;
using Shared.DTOs.Patient;

namespace Services
{
    internal class AppointmentService : IAppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AppointmentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<AppointmentDTO?> GetByIdAsync(int id)
        {
            var appointment = await _unitOfWork.GetRepository<Appointment, int>().GetByIdAsync(id);
            if (appointment == null)
                return null;
            return _mapper.Map<AppointmentDTO?>(appointment);
        }

        public async Task<int> GetTransactionId(int appointmentId)
        {
            var appointment = await _unitOfWork.GetRepository<Appointment, int>().GetByIdAsync(appointmentId);
            if (appointment == null)
                throw new ArgumentNullException($"Appointment with ID {appointmentId} doesn't exist");
            return appointment.TransactionId;
        }

        public async Task<PatientAppUserDTO> GetPatientByAppointmentId(int id)
        {
            var appointment = (await _unitOfWork.GetRepository<Appointment, int>().GetAllAsync(new AppointmentPatientSpecifications(a => a.Id == id))).FirstOrDefault();
            if (appointment == null)
                throw new ArgumentNullException($"Appointment with ID {id} doesn't exist");
            return _mapper.Map<PatientAppUserDTO>(appointment.Patient);
        }

        public async Task<List<AppointmentDTO>?> GetByPatientAsync(int patientId, int pageIndex = 1, int pageSize = 20)
        {
            var specs = new AppointmentPaginationSpecifications(a => a.PatientId == patientId, pageIndex, pageSize);
            var appointments = await _unitOfWork.GetRepository<Appointment, int>().GetAllAsync(specs);
            if (appointments == null)
                return null;
            return appointments.Select(_mapper.Map<AppointmentDTO>).ToList();
        }

        public int GetCount()
            => _unitOfWork.GetRepository<Appointment, int>().GetCount();

        public async Task AddAsync(int patientId, int doctorReservationId, int transactionId)
        {
            var appointment = new Appointment()
            {
                PatientId = patientId,
                DoctorReservationID = doctorReservationId,
                TransactionId = transactionId
            };
            await _unitOfWork.GetRepository<Appointment, int>().AddAsync(appointment);
            await _unitOfWork.SaveChangesAsync();
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
