using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Authentication
{
    public class ChangePasswordDto
    {
        [EmailAddress]
        public required string Email { get; set; }
        public required string OldPassword { get; set; }
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
       ErrorMessage = "Password must contain at least one uppercase letter, one number, and one special character.")]

        public required string NewPassword { get; set; }

    }
}
