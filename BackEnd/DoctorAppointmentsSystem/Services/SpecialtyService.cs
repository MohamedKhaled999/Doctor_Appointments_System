using AutoMapper;
using Domain.Contracts;
using Domain.Models;
using Services.Abstraction;
using Shared.DTOs.Doctor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class SpecialtyService : ISpecialtyService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public SpecialtyService(IUnitOfWork unitOfWork,IMapper mapper) 
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<List<SpecialtyDTO>> GetAllSpecialties()
        {
            var specialties = await  _unitOfWork.GetRepository<Specialty, int>().GetAllAsync();
            var specialtyDTOs = _mapper.Map<List<SpecialtyDTO>>(specialties);
            return specialtyDTOs;

        }
        public async Task<SpecialtyDTO> GetSpecialtyById(int id)
        {
            var specialty = await _unitOfWork.GetRepository<Specialty, int>().GetByIdAsync(id);
            if (specialty == null)
            {
                throw new Exception("Specialty not found");
            }
            var specialtyDTO = _mapper.Map<SpecialtyDTO>(specialty);
            return specialtyDTO;
        }
        public async Task AddSpecialty(SpecialtyDTO specialty)
        {
            var specialtyEntity = _mapper.Map<Specialty>(specialty);
            await _unitOfWork.GetRepository<Specialty, int>().AddAsync(specialtyEntity);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task UpdateSpecialty(SpecialtyDTO specialty)
        {
            var specialtyEntity = await _unitOfWork.GetRepository<Specialty, int>().GetByIdAsync(specialty.ID);
            if (specialtyEntity == null)
            {
                throw new Exception("Specialty not found");
            }
            specialtyEntity = _mapper.Map(specialty, specialtyEntity);
            _unitOfWork.GetRepository<Specialty, int>().Update(specialtyEntity);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task DeleteSpecialty(int id)
        {
            var specialty = await _unitOfWork.GetRepository<Specialty, int>().GetByIdAsync(id);
            if (specialty == null)
            {
                throw new Exception("Specialty not found");
            }
            _unitOfWork.GetRepository<Specialty, int>().Delete(specialty);
            await _unitOfWork.SaveChangesAsync();
        }
        
    }
    
}
