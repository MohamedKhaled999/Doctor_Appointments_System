using Shared.Authentication;
using Shared.DTOs.Admin_Dashboard;
using Shared.DTOs.Doctor;
using Shared.DTOs.Search;

namespace Services.Abstraction
{
    public interface IDoctorService
    {
        public Task AddAsync(DoctorRegisterDto doctorDTO);
        public Task UpdateDoctor(DoctorEditDTO doctorDTO, int userId);
        public Task<DoctorProfileDTO?> DoctorProfile(int doctorId);
        public Task<DoctorProfileDTO?> GetByAppUserIdAsync(int appUserId);
        public Task<DoctorUserProfileDTO?> GetUserProfileByAppUserIdAsync(int appUserId);
        public Task<List<DoctorSearchDTO>> SearchDoctor(FilterSearchDTO filter);
        public Task<SearchPageDTO> SearchPageDTO(FilterSearchDTO filter);
        public Task<bool> IsDoctorUserApproved(int appUserId);
        public Task ApproveDoctor(int docID);
        public Task<List<UnApprovedDoctorDTO>> GetUnApprovedDoctors();
        public Task ChangeImageUrl(int docId, string url);
        public Task<int> GetAppUserIdAsync(int doctorId);
    }
}
