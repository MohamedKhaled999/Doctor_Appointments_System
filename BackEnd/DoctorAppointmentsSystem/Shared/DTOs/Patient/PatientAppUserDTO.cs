using Shared.Enums;

namespace Shared.DTOs.Patient
{
    public class PatientAppUserDTO
    {
        public int Id { get; set; }
        public int AppUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public Governorate Governorate { get; set; }
        public DateOnly BirthDate { get; set; }
    }
}
