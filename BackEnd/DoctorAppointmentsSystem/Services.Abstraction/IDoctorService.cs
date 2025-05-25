using Shared.Authentication;
using Shared.DTOs.Account;
using Shared.DTOs.Doctor;
using Shared.DTOs.Search;
using System.Linq.Expressions;

namespace Services.Abstraction
{
    public interface IDoctorService
    {
        public Task AddAsync(DoctorRegisterDto doctorDTO);
        public Task UpdateDoctor(DoctorEditDTO doctorDTO);
        public Task<DoctorProfileDTO> DoctorProfile(int doctorId);
        public Task<List<DoctorSearchDTO>> SearchDoctor(FilterSearchDTO filter); 
        //Task<Doctor?> GetDoctorInfo(int doctorID);
        //Task<List<Doctor>> GetDoctorsOrderedByRating();
        //Task<List<Doctor>> GetAllDoctors();
        //Task<Doctor> GetDoctorByID(int id);
        //Task<List<Doctor>?> GetDoctorCondition(Expression<Func<Doctor, bool>> condition);
        //Task<List<Doctor>?> GetDoctorConditionByPage(int pageNum, int pageSize, Expression<Func<Doctor, bool>> condition);
        //Task<int> GetDoctorConditionCount(Expression<Func<Doctor, bool>> condition);
        //Task<DoctorProfileDto> GetDoctorProfileAsync(int doctorId);
        //Task<PagedList<DoctorSearchDto>> SearchDoctorsAsync(DoctorSearchCriteria criteria);
        //Task UpdateDoctorAsync(int doctorId, DoctorUpdateDto updateDto);
        //Task UpdateDoctorScheduleAsync(int doctorId, DoctorScheduleUpdateDto scheduleDto);
    }
}
