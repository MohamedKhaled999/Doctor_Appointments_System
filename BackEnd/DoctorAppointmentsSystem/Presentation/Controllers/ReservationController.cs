using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;
using Shared.DTOs.DoctorReservation;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize(Roles = "doctor")]
    [Route("api/doctor/reservations")]
    public class ReservationController : ApiController
    {
        private readonly IServiceManager _serviceManager;

        public ReservationController(IServiceManager serviceManager) => _serviceManager = serviceManager;

        [HttpGet]
        public async Task<IActionResult> GetReservations()
        {
            var reservations = _serviceManager.AppointmentOrchestrator.GetDoctorReservationByAppUserIdAsync(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Ok(reservations);
        }

        [HttpPost]
        public async Task<IActionResult> NewReservation(NewResDTO reservation)
        {
            await _serviceManager.AppointmentOrchestrator.AddDoctorReservationAsync(reservation);
            return Created();
        }

        [HttpDelete]
        public async Task<IActionResult> CancelReservation(int id)
        {
            await _serviceManager.AppointmentOrchestrator.CancelReservationAsync(id, int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return NoContent();
        }
    }
}
