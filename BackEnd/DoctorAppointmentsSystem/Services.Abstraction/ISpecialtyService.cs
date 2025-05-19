namespace Services.Abstraction
{
    public interface ISpecialtyService
    {
        Task<List<Specialty>> GetAllSpecialties();
        Task<Specialty> GetSpecialtyById(int id);
        void AddSpecialty(Specialty specialty);
        void UpdateSpecialty(Specialty specialty);
        void DeleteSpecialty(Specialty specialty);
        Task<IEnumerable<Doctor>> GetSpecialtyDoctors(int id);
    }
}
