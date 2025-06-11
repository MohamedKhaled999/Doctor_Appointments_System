using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class Review : EntityBase<int>
    {
        [DataType(DataType.Date)]
        public DateTime Date { get; set; } = DateTime.Now;
        [Range(0, 5)]
        public int Rate { get; set; }
        [StringLength(500, ErrorMessage = "Description can't be longer than 500 characters")]
        [DataType(DataType.MultilineText)]
        public string Description { get; set; }
        public int? PatientID { get; set; }
        public int DoctorID { get; set; }
        public virtual Doctor Doctor { get; set; }
        public virtual Patient? Patient { get; set; }
    }
}
