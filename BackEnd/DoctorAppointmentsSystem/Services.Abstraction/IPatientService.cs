using Shared.Authentication;
using Shared.DTOs.Patient;

namespace Services.Abstraction
{
    public interface IPatientService
    {
        Task<List<PatientDTO>?> GetAllAsync(int pageIndex, int pageSize);
        Task<PatientDTO?> GetByIdAsync(int id, int currentID = -1);
        Task<PatientDTO?> GetByAppUserIdAsync(int appUserId);
        int GetCount();
        Task AddAsync(RegisterDto registerDto);
        Task UpdateAsync(PatientDTO patientDto, int currentID);
        Task DeleteAsync(int appUserId);
    }
}
