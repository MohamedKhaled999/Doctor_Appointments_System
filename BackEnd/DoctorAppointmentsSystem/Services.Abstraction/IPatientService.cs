using Shared.DTOs.Patient;

namespace Services.Abstraction
{
    public interface IPatientService
    {
        Task<List<PatientDTO>?> GetAll();
        Task<PatientDTO?> GetById(int id);
        Task Add(PatientDTO patientDto);
        Task Update(PatientDTO patientDto);
        Task Delete(int id);
    }
}
