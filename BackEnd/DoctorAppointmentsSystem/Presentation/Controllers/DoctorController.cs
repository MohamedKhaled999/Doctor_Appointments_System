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
            return Ok(doctorProfile);
        }
        //[HttpPost("Register")]
        //public async Task<IActionResult> RegisterDoctor(DoctorRegisterDto doctorDTO)
        //{
        //    await _serviceManager.DoctorOrchestrator.RegisterDoctor(doctorDTO);
        //    return Created();
        //}
        [HttpGet("UserProfile")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> GetDoctorProfile()
        {
            var doctorProfile = await _serviceManager.DoctorService.DoctorProfile(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Ok(doctorProfile);
        }
        [HttpPut]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> UpdateDoctor(DoctorEditDTO doctorDTO)
        {
            await _serviceManager.DoctorService.UpdateDoctor(doctorDTO, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Ok(new { success = true });
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchDoctors([FromQuery] FilterSearchDTO searchDTO)
        {
            var doctors = await _serviceManager.DoctorService.SearchDoctor(searchDTO);
            return Ok(doctors);
        }
    }
}
