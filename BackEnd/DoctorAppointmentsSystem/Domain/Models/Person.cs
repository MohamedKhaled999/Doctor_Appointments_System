using Domain.Models.Enums;
using System.ComponentModel.DataAnnotations;


namespace Domain.Models
{
    public abstract class Person : EntityBase<int>
    {
        public int? AppUserID { get; set; }
        [StringLength(50, ErrorMessage = "First Name must be less than 50 characters")]
        [DataType(DataType.Text)]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "First Name must contain only letters")]
        public string FirstName { get; set; }

        [StringLength(50, ErrorMessage = "Last Name must be less than 50 characters")]
        [DataType(DataType.Text)]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Last Name must contain only letters")]
        public string LastName { get; set; }
        [RegularExpression(@"^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.com$", ErrorMessage = "Email must match the following pattern: test@test.com")]
        public string Email { get; set; }
        [DataType(DataType.Date)]
        public DateTime BirthDate { get; set; }
        public Governorate Governorate { get; set; }
        public string PhoneNumber { get; set; }
    }
}
