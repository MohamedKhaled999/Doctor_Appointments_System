using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;
using Shared.DTOs.Patient;
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
            var appointments = await _serviceManager.AppointmentOrchestrator.GetAppointmentsByAppUserIdAsync(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value), pageIndex, pageSize);
            return Ok(appointments);
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetCount()
        {
            var count = await _serviceManager.AppointmentOrchestrator.GetAppointmentCountByPatient(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Ok(new { count });
        }

        [HttpGet("docs")]
        public async Task<IActionResult> GetDocuments(int appointmentId)
        {
            var docs = await _serviceManager.AppointmentOrchestrator.GetAppointmentDocuments(appointmentId, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Ok(docs);
        }

        [HttpPost]
        public async Task<IActionResult> NewAppointment(int doctorReservationId)
        {
            var patientAppUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var paymentUrl = await _serviceManager.AppointmentOrchestrator.CreatePaymentSessionAsync(patientAppUserId, doctorReservationId);
            return Ok(new { paymentUrl });
        }

        [HttpPost("docs")]
        public async Task<IActionResult> AddDocument(int appointmentId, IFormFile document)
        {
            await _serviceManager.AppointmentOrchestrator.AddAppointmentDocuments(appointmentId, document, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Created();
        }

        [HttpDelete]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            await _serviceManager.AppointmentOrchestrator.CancelAppointmentAsync(id, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return NoContent();
        }

        [HttpDelete("docs")]
        public async Task<IActionResult> DeleteDocument(int appointmentId, string documentUrl)
        {
            await _serviceManager.AppointmentOrchestrator.DeleteAppointmentDocument(appointmentId, documentUrl, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return NoContent();
        }

        [HttpPost("review")]
        public async Task<IActionResult> AddReview(AddReviewDTO review)
        {
            await _serviceManager.AppointmentOrchestrator.AddReview(review, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Created();
        }
    }
}
