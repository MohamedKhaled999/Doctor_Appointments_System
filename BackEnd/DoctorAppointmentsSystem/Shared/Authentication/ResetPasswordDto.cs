using System.ComponentModel.DataAnnotations;

namespace Shared.Authentication
{
    public class ResetPasswordDto
    {
        //to properties
        // string email, string token, string newPassword

        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Token is required.")]
        public required string Token { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
       ErrorMessage = "Password must contain at least one uppercase letter, one number, and one special character.")]

        public required string NewPassword { get; set; }
    }
}
