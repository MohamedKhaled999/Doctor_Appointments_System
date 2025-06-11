using Domain.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class Doctor : Person
    {
        public bool IsApproved { get; set; } = false;
        public int SpecialtyID { get; set; }
        [DataType(DataType.Currency)]
        public int Fees { get; set; }
        [Range(0, 60)]
        [DataType(DataType.Duration)]
        [RegularExpression(@"^[0-9]*$", ErrorMessage = "Waiting Time must be a number")]
        public int WaitingTime { get; set; }
        [Range(0, 5)]
        public float OverallRating { get; set; }
        public string ImageURL { get; set; }
        [DataType(DataType.MultilineText)]
        [StringLength(500, ErrorMessage = "About Doctor must be less than 500 characters")]
        public string About { get; set; }
        [EnumDataType(typeof(WorkingDays))]
        public WorkingDays WorkingDays { get; set; }
        [DataType(DataType.Time)]
        public DateTime DefaultStartTime { get; set; }
        [DataType(DataType.Time)]
        public DateTime DefaultEndTime { get; set; }
        public int DefaultMaxReservations { get; set; }
        public string Location { get; set; }
        public Gender Gender { get; set; }
        public float Lat { get; set; }
        public float Lng { get; set; }
        public virtual Specialty Specialty { get; set; }
        public virtual ICollection<DoctorReservation>? DoctorReservations { get; set; }
        public virtual ICollection<Review>? Reviews { get; set; }

    }
}
