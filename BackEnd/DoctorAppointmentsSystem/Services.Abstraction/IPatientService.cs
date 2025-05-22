using Shared.DTOs.Patient;

namespace Services.Abstraction
{
    public interface IPatientService
    {
        Task<List<PatientDTO>?> GetAllAsync(int pageIndex, int pageSize);
        Task<PatientDTO?> GetByIdAsync(int id);
        int GetCount();
        Task AddAsync(PatientDTO patientDto);
        Task UpdateAsync(PatientDTO patientDto);
        Task DeleteAsync(int id);
    }
}
