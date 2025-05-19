using System.Linq.Expressions;

namespace Services.Abstraction
{
    public interface IDoctorService
    {
        Task AddDoctor(Doctor doctorVM);
        Task<Doctor?> GetDoctorInfo(int doctorID);
        Task UpdateDoctor(Doctor doctorVM);
        Task<List<Doctor>> GetDoctorsOrderedByRating();
        Task<List<Doctor>> GetAllDoctors();
        Task<Doctor> GetDoctorByID(int id);
        Task<List<Doctor>?> GetDoctorCondition(Expression<Func<Doctor, bool>> condition);
        Task<List<Doctor>?> GetDoctorConditionByPage(int pageNum, int pageSize, Expression<Func<Doctor, bool>> condition);
        Task<int> GetDoctorConditionCount(Expression<Func<Doctor, bool>> condition);
    }
}
