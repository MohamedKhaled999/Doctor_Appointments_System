using AutoMapper;
using Domain.Contracts;
using Domain.Models;
using Services.Abstraction;
using Services.Specifications.Home;
using Shared.DTOs.Home;

namespace Services
{
    internal class HomeService : IHomeService
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
            var specialtiesDTO = new List<HomeSpecialtyDTO>();
            var specialties = await _unitOfWork.GetRepository<Specialty, int>().GetAllAsync();
            var doctors = await _unitOfWork.GetRepository<Doctor, int>().GetAllAsync(new HomeDoctorSpecifications());

            foreach (var specialty in specialties)
                specialtiesDTO.Add(
                    new HomeSpecialtyDTO()
                    {
                        Name = specialty.Name,
                        Description = specialty.Description,
                        Image = specialty.ImageURL,
                        NumberOfDoctors = _unitOfWork.GetRepository<Doctor, int>().GetCount(new HomeSpecialtySpecifications(d => d.SpecialtyID == specialty.Id))
                    });

            return new HomeDTO()
            {
                Specialties = specialtiesDTO,
                Doctors = doctors.Select(_mapper.Map<HomeDoctorDTO>).ToList()
            };
        }
    }
}
