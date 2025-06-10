using Microsoft.AspNetCore.Http;
using Shared.Authentication;
using Shared.DTOs.Doctor;

namespace Services.Abstraction.Orchestrators
{
    public interface IDoctorOrchestrator
    {
        public Task RegisterDoctor(DoctorRegisterDto dto);
        public Task<ICollection<ReviewDTO>?> GetDoctorReviews(int appuserid, int pageNumber = 1, int pageSize = 10);
        public Task<DoctorUserProfileDTO?> GetUserProfileByAppUserIdAsync(int appUserId);
        public Task ChangeProfileImage(int appUserId, IFormFile image);


    }
}
