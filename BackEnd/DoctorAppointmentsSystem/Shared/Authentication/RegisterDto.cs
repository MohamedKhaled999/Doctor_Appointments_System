using Shared.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Authentication
{
    public record RegisterDto
    {
        [Display(Name = "First Name")]
        [RegularExpression("^[a-zA-Z0-9](?:[a-zA-Z0-9_ -]*[a-zA-Z0-9])?$", ErrorMessage = "Invalid Name Format")]
        public string FirstName { get; set; }
        [Display(Name = "Last Name")]
        [RegularExpression("^[a-zA-Z0-9](?:[a-zA-Z0-9_ -]*[a-zA-Z0-9])?$", ErrorMessage = "Invalid Name Format")]
        public string LastName { get; set; }
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        ErrorMessage = "Password must contain at least one uppercase letter, one number, and one special character.")]
        public string Password { get; set; }

        [EmailAddress]
        public string Email { get; set; }
        [Display(Name = "Phone Number")]
        [RegularExpression("^0\\d{10}$", ErrorMessage = "Invalid Phone Number")]
        public string PhoneNumber { get; set; }
        public Governorate Governorate { get; set; }
        public DateOnly BirthDate { get; set; } = DateOnly.FromDateTime(DateTime.Now.AddDays(-1));



    }


}
