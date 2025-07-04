﻿using Shared.DTOs.Doctor;

namespace Services.Abstraction
{
    public interface ISpecialtyService
    {
        Task<List<SpecialtyDTO>> GetAllSpecialties();
        Task<SpecialtyDTO> GetSpecialtyById(int id);
        Task AddSpecialty(NewSpecialtyDTO specialty, string url);
        Task UpdateSpecialty(SpecialtyDTO specialty);
        Task DeleteSpecialty(int id);
    }
}
