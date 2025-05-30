using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize(Roles = "patient")]
    [Route("api/patient/appointments")]
    public class AppointmentController : ApiController
    {
        private readonly IServiceManager _serviceManager;

        public AppointmentController(IServiceManager serviceManager) => _serviceManager = serviceManager;

        [HttpGet]
        public async Task<IActionResult> GetAppointments(int pageIndex, int pageSize)
        {
            var appointments = _serviceManager.AppointmentOrchestrator.GetAppointmentsByAppUserIdAsync(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value), pageIndex, pageSize);
            return Ok(appointments);
        }

        [HttpPost]
        public async Task<IActionResult> NewAppointment(int doctorReservationId)
        {
            var patientAppUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var paymentUrl = await _serviceManager.AppointmentOrchestrator.CreatePaymentSessionAsync(patientAppUserId, doctorReservationId);
            return Ok(paymentUrl);
        }

        [HttpDelete]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            await _serviceManager.AppointmentOrchestrator.CancelAppointmentAsync(id, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return NoContent();
        }
    }
}
