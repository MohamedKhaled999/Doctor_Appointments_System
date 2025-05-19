using Shared.DTOs.Appointment;
using Shared.Enums;
using Shared.ValidationAttributes;
using System.ComponentModel.DataAnnotations;

namespace Shared.DTOs.Patient
{
    public class PatientDTO
    {
        public int Id { get; set; }
        [Display(Name = "First Name")]
        public string FirstName { get; set; }
        [Display(Name = "Last Name")]
        public string LastName { get; set; }
        [RegularExpression(@"^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.com$", ErrorMessage = "Email must match the following pattern: test@test.com")]
        public string Email { get; set; }
        [Display(Name = "Phone Number")]
        [RegularExpression("^0\\d{10}$", ErrorMessage = "Invalid Phone Number")]
        public string PhoneNumber { get; set; }
        public Governorate Governorate { get; set; }
        [Display(Name = "Birth Date")]
        [ValidDate]
        public DateOnly BirthDate { get; set; }
        public List<AppointmentDTO>? Appointments { get; set; }
    }
}
