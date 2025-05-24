using Shared.DTOs.Doctor;

namespace Services.Abstraction
{
    public interface ISpecialtyService
    {
        Task<List<SpecialtyDTO>> GetAllSpecialties();
        Task<SpecialtyDTO> GetSpecialtyById(int id);
        Task AddSpecialty(SpecialtyDTO specialty);
        Task UpdateSpecialty(SpecialtyDTO specialty);
        Task DeleteSpecialty(int id);
        //Task<IEnumerable<Doctor>> GetSpecialtyDoctors(int id);
    }
}
