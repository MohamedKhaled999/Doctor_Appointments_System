using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Caching;
using Services.Abstraction;
using Shared.DTOs.Doctor;

namespace Presentation.Controllers
{
    //[Authorize(Roles = "admin")]
    public class AdminController : ApiController
    {
        private readonly IServiceManager _serviceManager;
        public AdminController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }

        [HttpGet("FullDashBoard")]
        // [RedisCaching]
        public async Task<IActionResult> GetFullDashboard()
        {
            var dashboard = await _serviceManager.AdminOrchestrator.GetDashboardDataAsync();
            return Ok(dashboard);
        }
        [HttpPost("AddSpeciality")]
        public async Task<IActionResult> AddSpeciality(NewSpecialtyDTO specialtyDTO)
        {
            await _serviceManager.AdminOrchestrator.AddSpecialty(specialtyDTO);
            return Created("", new { success = true });
        }
        [HttpPost("ApproveDoctor")]
        public async Task<IActionResult> ApproveDoctor(int doctorId)
        {
            await _serviceManager.AdminOrchestrator.ApproveDoctor(doctorId);
            return Ok(new { success = true });
        }
    }
}
