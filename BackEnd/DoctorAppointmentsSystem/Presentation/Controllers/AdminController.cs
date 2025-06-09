using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;
using Services.Abstraction.Orchestrators;
using Shared.DTOs.Doctor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public async Task<IActionResult> GetFullDashboard()
        {
            var dashboard = await _serviceManager.AdminOrchestrator.GetDashboardDataAsync();
            return Ok(dashboard);
        }
        [HttpPost("AddSpeciality")]
        public async Task<IActionResult> AddSpeciality(SpecialtyDTO specialtyDTO)
        {
            // Remember to add a new dto
            await _serviceManager.SpecialtyService.AddSpecialty(specialtyDTO);
            return Created("", new { success = true });
        }

    }
}
