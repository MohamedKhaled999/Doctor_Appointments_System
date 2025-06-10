using Microsoft.AspNetCore.Http;
using Services.Abstraction;
using Services.Abstraction.Orchestrators;
using Shared.Authentication;
using Shared.DTOs.Doctor;

namespace Services.Orchestrators
{
    internal class DoctorOrchestrator : IDoctorOrchestrator
    {
        private readonly IDoctorService doctorService;
        private readonly IUploadService uploadService;
        private readonly IServiceManager _serviceManger;
        public DoctorOrchestrator(IServiceManager serviceManager)
        {
            doctorService = serviceManager.DoctorService;
            uploadService = serviceManager.UploadService;
            _serviceManger = serviceManager;
        }
        async Task IDoctorOrchestrator.RegisterDoctor(DoctorRegisterDto dto)
        {
            var ImgUrl = await uploadService.UploadFile(dto.Image);
            dto.ImageURL = ImgUrl;
            await doctorService.AddAsync(dto);
        }
        public async Task ChangeProfileImage(int appUserId, IFormFile image)
        {
            var doctor = await doctorService.GetByAppUserIdAsync(appUserId);
            if (doctor == null)
                throw new Exception("Doctor not found");
            var ImgUrl = await uploadService.UploadFile(image);
            await doctorService.ChangeImageUrl(doctor.ID,ImgUrl);
        }
        public async Task<ICollection<ReviewDTO>> GetDoctorReviews(int appuserid, int pageNumber = 1, int pageSize = 10)
        {
            var doctor = await doctorService.GetByAppUserIdAsync(appuserid);
            var reviews = await _serviceManger.ReviewService.GetDoctorReviews(doctor.ID, pageNumber, pageSize);
            return reviews;
        }
        public async Task<DoctorUserProfileDTO?> GetUserProfileByAppUserIdAsync(int appUserId)
        {
            var doctorProfile = await doctorService.GetUserProfileByAppUserIdAsync(appUserId);
            if (doctorProfile == null)
                return null;
            doctorProfile.Rating = await _serviceManger.ReviewService.GetDoctorAverageRating(doctorProfile.ID);
            return doctorProfile;
        }
    }
}
