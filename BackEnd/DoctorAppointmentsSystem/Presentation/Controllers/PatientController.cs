using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;
using Shared.DTOs.Patient;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize(Roles = "patient")]
    public class PatientController : ApiController
    {
        private readonly IServiceManager _serviceManager;

        public PatientController(IServiceManager serviceManager) => _serviceManager = serviceManager;

        [HttpGet]
        public async Task<IActionResult> GetPatient()
        {
            var patient = await _serviceManager.PatientService.GetByAppUserIdAsync(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Ok(patient);
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePatient(PatientDTO patient)
        {
            await _serviceManager.PatientService.UpdateAsync(patient, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Ok(new { success = true });
        }

        [HttpDelete]
        public async Task<IActionResult> DeletePatient()
        {
            await _serviceManager.PatientService.DeleteAsync(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return NoContent();
        }
    }
}
