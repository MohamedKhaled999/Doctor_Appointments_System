using AutoMapper;
using Domain.Contracts;
using Domain.Exceptions;
using Domain.Models;
using Services.Abstraction;
using Services.Specifications;
using Services.Validators;
using Shared.Authentication;
using Shared.DTOs.Patient;

namespace Services
{
    internal class PatientService : IPatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly PatientValidator _validator = new();

        public PatientService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<PatientDTO>?> GetAllAsync(int pageIndex = 1, int pageSize = 20)
        {
            var specs = new PatientPaginationSpecifications(pageIndex, pageSize);
            var patients = await _unitOfWork.GetRepository<Patient, int>().GetAllAsync(specs);
            if (patients == null)
                return null;
            return _mapper.Map<List<PatientDTO>>(patients);
        }

        public async Task<PatientDTO?> GetByIdAsync(int id, int currentID = -1)
        {
            var patient = await _unitOfWork.GetRepository<Patient, int>().GetByIdAsync(id);
            if (patient == null)
                return null;
            if (currentID != -1 && patient.AppUserID != currentID)
                throw new UnAuthorizedException("Access Denied");
            return _mapper.Map<PatientDTO>(patient);
        }

        public async Task<PatientDTO?> GetByAppUserIdAsync(int appUserId)
        {
            var specs = new SpecificationsBase<Patient>(p => p.AppUserID == appUserId);
            var patient = (await _unitOfWork.GetRepository<Patient, int>().GetAllAsync(specs)).FirstOrDefault();
            if (patient == null)
                return null;
            return _mapper.Map<PatientDTO>(patient);
        }

        public int GetCount()
            => _unitOfWork.GetRepository<Patient, int>().GetCount();

        public async Task AddAsync(RegisterDto patientDto)
        {
            var patient = _mapper.Map<Patient>(patientDto);
            var result = _validator.Validate(patient);
            if (result.IsValid)
            {
                await _unitOfWork.GetRepository<Patient, int>().AddAsync(patient);
                await _unitOfWork.SaveChangesAsync();
            }
            else
            {
                var errors = result.Errors.Select(e => e.ErrorMessage).ToList();

                throw new ValidationException(errors);
            }
        }

        public async Task UpdateAsync(PatientDTO patientDto, int currentID)
        {
            var newPatient = _mapper.Map<Patient>(patientDto);
            var result = _validator.Validate(newPatient);
            if (result.IsValid)
            {
                var oldPatient = await GetByAppUserIdInsideAsync(currentID);
                patientDto.Id = oldPatient.Id;
                if (oldPatient == null)
                    throw new ArgumentNullException($"Patient with ID {patientDto.Id} doesn't exist");
                var email = oldPatient.Email;
                var updatedPatient = _mapper.Map(patientDto, oldPatient);
                updatedPatient.Email = email;
                _unitOfWork.GetRepository<Patient, int>().Update(updatedPatient);
                await _unitOfWork.SaveChangesAsync();
            }
            else
            {
                var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ValidationException(errors);
            }
        }

        public async Task DeleteAsync(int appUserId)
        {
            var patient = await GetByAppUserIdInsideAsync(appUserId);
            if (patient == null)
                throw new ArgumentNullException($"Patient doesn't exist");
            _unitOfWork.GetRepository<Patient, int>().Delete(patient);
            await _unitOfWork.SaveChangesAsync();
        }

        private async Task<Patient?> GetByAppUserIdInsideAsync(int appUserId)
        {
            var specs = new SpecificationsBase<Patient>(p => p.AppUserID == appUserId);
            var patient = (await _unitOfWork.GetRepository<Patient, int>().GetAllAsync(specs)).FirstOrDefault();
            if (patient == null)
                return null;
            return patient;
        }
    }
}
