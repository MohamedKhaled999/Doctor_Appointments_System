using AutoMapper;
using Domain.Contracts;
using Domain.Models;
using Services.Abstraction;
using Services.Validators;
using Shared.Authentication;
using Shared.DTOs.Admin_Dashboard;
using Shared.DTOs.Doctor;
using Shared.DTOs.Search;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;

namespace Services
{
    internal class DoctorService : IDoctorService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly DoctorValidator _validator;
        public DoctorService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _validator = new();
        }
        public async Task AddAsync(DoctorRegisterDto doctorDTO)
        {
            var newDoc = _mapper.Map<Doctor>(doctorDTO);
            if ((await _validator.ValidateAsync(newDoc)).IsValid)
            {
                await _unitOfWork.GetRepository<Doctor, int>().AddAsync(newDoc);
                await _unitOfWork.SaveChangesAsync();
            }
            else
            {
                var errors = new List<string>();
                foreach (var error in (await _validator.ValidateAsync(newDoc)).Errors)
                    errors.Add(error.ErrorMessage);
                throw new Domain.Exceptions.ValidationException(errors);
            }
        }
        public async Task UpdateDoctor(DoctorEditDTO doctorDTO, int userId)
        {
            var doctor = await _unitOfWork.GetRepository<Doctor, int>().GetByIdAsync(doctorDTO.Id);
            if (doctor == null)
                throw new Exception("Doctor not found");
            if (doctor.AppUserID != userId)
                throw new Domain.Exceptions.UnAuthorizedException("Access Denied");
            var updatedDoctor = _mapper.Map(doctorDTO, doctor);
            if (_validator.Validate(updatedDoctor).IsValid)
            {
                _unitOfWork.GetRepository<Doctor, int>().Update(updatedDoctor);
                await _unitOfWork.SaveChangesAsync();
            }
            else
            {
                var errors = new List<string>();
                foreach (var error in _validator.Validate(updatedDoctor).Errors)
                    errors.Add(error.ErrorMessage);
                throw new ValidationException(string.Join(", ", errors));
            }
        }
        public async Task<DoctorProfileDTO> DoctorProfile(int doctorId)
        {
            var doctor = await _unitOfWork.GetRepository<Doctor, int>().GetByIdAsync(doctorId);
            if (doctor == null)
                return null;
            var doctorDTO = _mapper.Map<DoctorProfileDTO>(doctor);
            return doctorDTO;
        }
        public async Task<DoctorProfileDTO?> GetByAppUserIdAsync(int appUserId)
        {
            var specs = new SpecificationsBase<Doctor>(d => d.AppUserID == appUserId);
            specs.AddInclude(d => d.Specialty);
            var doctor = (await _unitOfWork.GetRepository<Doctor, int>().GetAllAsync(specs)).FirstOrDefault();
            if (doctor == null)
                return null;
            return _mapper.Map<DoctorProfileDTO>(doctor);
        }
        public async Task<DoctorUserProfileDTO?> GetUserProfileByAppUserIdAsync(int appUserId)
        {
            var specs = new SpecificationsBase<Doctor>(d => d.AppUserID == appUserId);
            specs.AddInclude(d => d.Specialty);
            var doctor = (await _unitOfWork.GetRepository<Doctor, int>().GetAllAsync(specs)).FirstOrDefault();
            if (doctor == null)
                return null;
            return _mapper.Map<DoctorUserProfileDTO>(doctor);
        }
        public async Task<List<DoctorSearchDTO>> SearchDoctor(FilterSearchDTO filter)
        {
            filter.Name = filter.Name?.Trim().ToLower() ?? "";

            Expression<Func<Doctor, bool>> condition = doc =>
                    (filter.Name == "" || (doc.FirstName + " " + doc.LastName).ToLower().Trim().Contains(filter.Name)) &&
                    (filter.Specialty == 0 || doc.SpecialtyID == filter.Specialty) &&
                    (filter.Gender == Shared.Enums.Gender.All || doc.Gender == (Domain.Models.Enums.Gender)filter.Gender) &&
                    (filter.Governorate == Shared.Enums.Governorate.All || doc.Governorate == (Domain.Models.Enums.Governorate)filter.Governorate) &&
                    doc.Fees >= filter.MinPrice && doc.Fees <= filter.MaxPrice && doc.WaitingTime <= filter.WaitingTime;

            SpecificationsBase<Doctor> spec = new SpecificationsBase<Doctor>(condition);
            spec.ApplyPagination(filter.PageNum, filter.PageSize);
            spec.AddInclude(d => d.Specialty);
            var doctorsTask = await _unitOfWork.GetRepository<Doctor, int>().GetAllAsync(spec);
            var doctors = _mapper.Map<ICollection<DoctorSearchDTO>>(doctorsTask);


            return doctors.ToList();

        }
        
        
        public async Task<SearchPageDTO> SearchPageDTO(FilterSearchDTO filter)
        {
            var doctors = await SearchDoctor(filter);
            filter.Name = filter.Name?.Trim().ToLower() ?? "";

            Expression<Func<Doctor, bool>> condition = doc =>
                    (filter.Name == "" || (doc.FirstName + " " + doc.LastName).ToLower().Trim().Contains(filter.Name)) &&
                    (filter.Specialty == 0 || doc.SpecialtyID == filter.Specialty) &&
                    (filter.Gender == Shared.Enums.Gender.All || doc.Gender == (Domain.Models.Enums.Gender)filter.Gender) &&
                    (filter.Governorate == Shared.Enums.Governorate.All || doc.Governorate == (Domain.Models.Enums.Governorate)filter.Governorate) &&
                    doc.Fees >= filter.MinPrice && doc.Fees <= filter.MaxPrice && doc.WaitingTime <= filter.WaitingTime;
            
            SpecificationsBase<Doctor> spec = new SpecificationsBase<Doctor>(condition);
            var filtereddoctors = await _unitOfWork.GetRepository<Doctor, int>().GetAllAsync(spec);
            return new SearchPageDTO
            {
                TotalPageNumber = (int)Math.Ceiling((double)filtereddoctors.Count() / filter.PageSize),
                Doctors = doctors
            };
        }
        public async Task ApproveDoctor(int docID)
        {
            var doc = await _unitOfWork.GetRepository<Doctor,int>().GetByIdAsync(docID);
            if (doc == null)
                throw new ValidationException("No doctor with this id");
            doc.IsApproved = true;
            _unitOfWork.GetRepository<Doctor, int>().Update(doc);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task<List<UnApprovedDoctorDTO>> GetUnApprovedDoctors()
        {
            var specs = new SpecificationsBase<Doctor>(r => r.IsApproved == false);
            specs.AddInclude(d => d.Specialty);
            var unApprovedDoctors = await _unitOfWork.GetRepository<Doctor, int>().GetAllAsync(specs);
            if (unApprovedDoctors == null || unApprovedDoctors.Count == 0)
                return new List<UnApprovedDoctorDTO>();
            var unApprovedDoctorsDTO = _mapper.Map<List<UnApprovedDoctorDTO>>(unApprovedDoctors);
            return unApprovedDoctorsDTO;
        }
        public async Task ChangeImageUrl(int docId,string url)
        {
            var doctor = await _unitOfWork.GetRepository<Doctor, int>().GetByIdAsync(docId);
            if (doctor == null)
                throw new Exception("Doctor not found");
            doctor.ImageURL = url;
            _unitOfWork.GetRepository<Doctor, int>().Update(doctor);
            await _unitOfWork.SaveChangesAsync();

        }
    }
}
