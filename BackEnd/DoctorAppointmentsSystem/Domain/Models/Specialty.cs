using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class Specialty : EntityBase<int>
    {
        [DataType(DataType.Text)]
        [StringLength(50, ErrorMessage = "Specialty Name must be less than 50 characters")]
        [RegularExpression(@"^[a-zA-Z\s]*$", ErrorMessage = "Specialty Name must be alphabetic")]
        public string Name { get; set; }
        public string ImageURL { get; set; }
        public virtual ICollection<Doctor>? Doctors { get; set; }
    }
}
