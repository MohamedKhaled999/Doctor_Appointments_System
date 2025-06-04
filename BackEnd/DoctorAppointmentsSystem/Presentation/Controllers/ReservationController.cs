using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;
using Shared.DTOs.DoctorReservation;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Route("api/doctor/reservations")]
    public class ReservationController : ApiController
    {
        private readonly IServiceManager _serviceManager;

        public ReservationController(IServiceManager serviceManager) => _serviceManager = serviceManager;

        [HttpGet]
        public async Task<IActionResult> GetReservations(int doctorId = 0)
        {
            List<DoctorReservationDTO>? reservations;
            if (doctorId == 0)
                reservations = await _serviceManager.AppointmentOrchestrator.GetDoctorReservationsByAppUserIdAsync(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            else
                reservations = await _serviceManager.DoctorReservationService.GetReservationsByDocID(doctorId);
            return Ok(reservations);
        }

        [HttpPost]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> NewReservation(NewResDTO reservation)
        {
            reservation.ResID = 0;
            await _serviceManager.AppointmentOrchestrator.AddDoctorReservationAsync(reservation, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Created();
        }

        [HttpPost("prescription")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> AddPrescription(int reservationId, int appointmentId, IFormFile document)
        {
            await _serviceManager.AppointmentOrchestrator.AddAppointmentPrescription(reservationId, appointmentId, document, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Created();
        }

        [HttpDelete]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> CancelReservation(int id)
        {
            await _serviceManager.AppointmentOrchestrator.CancelReservationAsync(id, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return NoContent();
        }

        [HttpDelete("prescription")]
        [Authorize(Roles = "doctor")]
        public async Task<IActionResult> DeletePrescription(int reservationId, int appointmentId)
        {
            await _serviceManager.AppointmentOrchestrator.DeleteAppointmentPrescription(reservationId, appointmentId, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return NoContent();
        }
    }
}
