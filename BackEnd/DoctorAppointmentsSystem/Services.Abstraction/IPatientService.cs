using Shared.Authentication;
using Shared.DTOs.Patient;

namespace Services.Abstraction
{
    public interface IPatientService
    {
        Task<List<PatientDTO>?> GetAllAsync(int pageIndex, int pageSize);
        Task<PatientDTO?> GetByIdAsync(int id, int oldId);
        int GetCount();
        Task AddAsync(RegisterDto registerDto);
        Task UpdateAsync(PatientDTO patientDto, int oldId);
        Task DeleteAsync(int id, int oldId);
    }
}
