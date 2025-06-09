using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;
using Shared.DTOs.Doctor;
using Shared.DTOs.Search;
using System.Security.Claims;

namespace Presentation.Controllers
{
    public class DoctorController : ApiController
    {
        private readonly IServiceManager _serviceManager;
        public DoctorController(IServiceManager serviceManager) => _serviceManager = serviceManager;
        [HttpGet("Profile/{id:int}")]
        public async Task<IActionResult> GetDoctorProfile(int id)
        {
            var doctorProfile = await _serviceManager.DoctorService.DoctorProfile(id);
            if (doctorProfile == null)
                return NotFound();
            return Ok(doctorProfile);
        }
        [HttpGet("UserProfile")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> GetDoctorProfile()
        {
            var doctorProfile = await _serviceManager.DoctorOrchestrator.GetUserProfileByAppUserIdAsync(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            if (doctorProfile == null)
                return NotFound();
            return Ok(doctorProfile);
        }
        [HttpPut]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> UpdateDoctor([FromBody]DoctorEditDTO doctorDTO)
        {
            await _serviceManager.DoctorService.UpdateDoctor(doctorDTO, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Ok(new { success = true });
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchDoctors([FromQuery] FilterSearchDTO searchDTO)
        {
            var doctors = await _serviceManager.DoctorService.SearchPageDTO(searchDTO);
            return Ok(doctors);
        }
        [HttpGet("Reviews")]
        public async Task<IActionResult> GetDoctorReviews(int page = 1, int pageSize = 5)
        {
            var reviews = await _serviceManager.DoctorOrchestrator.GetDoctorReviews(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value), page, pageSize);
            return Ok(reviews);
        }
    }
}
