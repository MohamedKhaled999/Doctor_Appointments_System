using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize(Roles = "patient")]
    [Route("patient/appointments")]
    public class AppointmentController : ApiController
    {
        private readonly IServiceManager _serviceManager;

        public AppointmentController(IServiceManager serviceManager) => _serviceManager = serviceManager;

        [HttpPost]
        public async Task<IActionResult> NewAppointment(int doctorReservationId)
        {
            var patientId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            await _serviceManager.AppointmentOrchestrator.AddAppointmentAsync(patientId, doctorReservationId);
            return Created();
        }

        [HttpDelete]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            await _serviceManager.AppointmentOrchestrator.CancelAppointmentAsync(id, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return NoContent();
        }
    }
}
