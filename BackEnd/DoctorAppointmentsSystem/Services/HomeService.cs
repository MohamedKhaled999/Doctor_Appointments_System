using AutoMapper;
using Domain.Contracts;
using Domain.Models;
using Domain.Specifications.Home;
using Services.Abstraction;
using Shared.DTOs.Home;

namespace Services
{
    public class HomeService : IHomeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public HomeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<HomeDTO> GetHomeData()
        {
            var doctorsPerSpecialty = new Dictionary<int, int?>();
            var specialties = await _unitOfWork.GetRepository<Specialty, int>().GetAllAsync();
            var doctors = await _unitOfWork.GetRepository<Doctor, int>().GetAllAsync(new HomeDoctorSpecifications());

            foreach (var specialty in specialties)
                doctorsPerSpecialty[specialty.Id] = _unitOfWork.GetRepository<Doctor, int>().GetCount(new HomeSpecialtySpecifications(d => d.SpecialtyID == specialty.Id));

            return new HomeDTO()
            {
                Specialties = specialties.Select(s => s.Name).ToList(),
                Doctors = doctors.Select(_mapper.Map<HomeDoctorDTO>).ToList(),
                DoctorsPerSpecialtyCount = doctorsPerSpecialty
            };
        }
    }
}
