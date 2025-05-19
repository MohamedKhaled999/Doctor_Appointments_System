using Shared.ValidationAttributes;
using System.ComponentModel.DataAnnotations;

namespace Shared.DTOs.DoctorReservation
{
    public class ScheduleDTO
    {
        [Display(Name = "Working Days")]
        public string[] Days { get; set; } = new string[7];
        [Display(Name = "From")]
        public TimeOnly StartTime { get; set; }
        [Display(Name = "To")]
        [ValidEndTime]
        public TimeOnly EndTime { get; set; }
        [Display(Name = "Reservation Quota")]
        [Range(1, int.MaxValue, ErrorMessage = "Reservation quota must be a positive number")]
        public int ReservationQuota { get; set; }
    }
}