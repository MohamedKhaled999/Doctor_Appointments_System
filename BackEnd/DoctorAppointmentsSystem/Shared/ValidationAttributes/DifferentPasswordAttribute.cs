using Shared.DTOs.Account;
using System.ComponentModel.DataAnnotations;

namespace Shared.ValidationAttributes
{
    public class DifferentPasswordAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var model = (ChangePasswordDTO)validationContext.ObjectInstance;
            if (model.OldPassword == model.NewPassword)
                return new ValidationResult("old password can't match new password");
            return ValidationResult.Success;
        }
    }
}
