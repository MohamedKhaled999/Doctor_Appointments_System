using AutoMapper;
using Domain.Contracts;
using Domain.Exceptions;
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

        public async Task<AppointmentDTO?> GetWithDoctorAsync(int id)
        {
            var appointment = (await _unitOfWork.GetRepository<Appointment, int>().GetAllAsync(new AppointmentDoctorSpecifications(a => a.Id == id))).FirstOrDefault();
            if (appointment == null)
                throw new ArgumentNullException($"Appointment with ID {id} doesn't exist");
            return _mapper.Map<AppointmentDTO>(appointment);
        }

        public async Task<AppointmentDTO?> GetLastAppointmentByPatientAsync(int patientId)
        {
            var appointment = (await _unitOfWork.GetRepository<Appointment, int>().GetAllAsync(new AppointmentDoctorSpecifications(a => a.PatientId == patientId))).LastOrDefault();
            if (appointment == null)
                throw new ArgumentNullException($"Appointment doesn't exist");
            return _mapper.Map<AppointmentDTO>(appointment);
        }

        public async Task AddAppointmentDocument(int appointmentId, string documentUrl)
        {
            var appointment = await _unitOfWork.GetRepository<Appointment, int>().GetByIdAsync(appointmentId);
            if (appointment.DocumentUrls == null)
                appointment.DocumentUrls = documentUrl;
            else if (appointment.DocumentUrls.Split("||").Length == 3)
                throw new ValidationException(["Maximum Number of Documents Exceeded"]);
            else
                appointment.DocumentUrls += "||" + documentUrl;
            _unitOfWork.GetRepository<Appointment, int>().Update(appointment);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task AddAppointmentPrescription(int appointmentId, string prescriptionUrl)
        {
            var appointment = await _unitOfWork.GetRepository<Appointment, int>().GetByIdAsync(appointmentId);
            if (appointment.PrescriptionUrl == null)
                appointment.PrescriptionUrl = prescriptionUrl;
            else
                throw new ValidationException(["Prescription Already Exists"]);
            _unitOfWork.GetRepository<Appointment, int>().Update(appointment);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAppointmentDocument(int appointmentId, string documentUrl)
        {
            var appointment = await _unitOfWork.GetRepository<Appointment, int>().GetByIdAsync(appointmentId);
            if (appointment.DocumentUrls == null || !appointment.DocumentUrls.Split("||").Contains(documentUrl))
                throw new ValidationException(["Document isn't available"]);
            else
                appointment.DocumentUrls = string.Join("||", appointment.DocumentUrls.Split("||").Where(d => d != documentUrl));
            _unitOfWork.GetRepository<Appointment, int>().Update(appointment);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAppointmentPrescription(int appointmentId)
        {
            var appointment = await _unitOfWork.GetRepository<Appointment, int>().GetByIdAsync(appointmentId);
            if (appointment.PrescriptionUrl == null)
                throw new ValidationException(["Prescription isn't available"]);
            else
                appointment.PrescriptionUrl = null;
            _unitOfWork.GetRepository<Appointment, int>().Update(appointment);
            await _unitOfWork.SaveChangesAsync();
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
            var appointment = (await _unitOfWork.GetRepository<Appointment, int>().GetAllAsync(new AppointmentPatientDoctorSpecifications(a => a.Id == id))).FirstOrDefault();
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

        public int GetCount(int patientId)
        {
            var specs = new SpecificationsBase<Appointment>(a => a.PatientId == patientId);
            return _unitOfWork.GetRepository<Appointment, int>().GetCount(specs);
        }


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
