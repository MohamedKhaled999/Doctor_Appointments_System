using Shared.ValidationAttributes;
using System.ComponentModel.DataAnnotations;

namespace Shared.DTOs.Account
{
    public class ChangePasswordDTO
    {
        public string OldPassword { get; set; }
        [DataType(DataType.Password)]
        [Display(Name = "New Password")]
        [DifferentPassword]
        [Required(ErrorMessage = "New password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
        ErrorMessage = "Password must contain at least one uppercase letter, one number, and one special character.")]
        public string NewPassword { get; set; }
        [Compare("NewPassword")]
        [Display(Name = "Confirm Password")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}
