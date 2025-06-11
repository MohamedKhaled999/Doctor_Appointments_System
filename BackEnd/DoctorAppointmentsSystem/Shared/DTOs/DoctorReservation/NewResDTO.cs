using System.ComponentModel.DataAnnotations;

namespace Shared.DTOs.DoctorReservation
{
    public class NewResDTO
    {
        public int ResID { get; set; }
        public int DoctorID { get; set; }
        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }
        [Required]
        [DataType(DataType.Time)]
        public TimeSpan StartTime { get; set; }
        [Required]
        [DataType(DataType.Time)]
        public TimeSpan EndTime { get; set; }
        [Required]
        [Range(1, 50, ErrorMessage = "Max Reservations must be between 1 and 50.")]
        public int MaxRes { get; set; }
    }
}
