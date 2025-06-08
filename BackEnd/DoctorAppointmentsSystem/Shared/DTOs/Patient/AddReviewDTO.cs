using System.ComponentModel.DataAnnotations;

namespace Shared.DTOs.Patient
{
    public class AddReviewDTO
    {
        public int DoctorReservationId { get; set; }
        public string Review { get; set; }
        [Range(0, 5)]
        public int Rate { get; set; }
    }
}
