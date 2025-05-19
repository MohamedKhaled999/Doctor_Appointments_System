using System.ComponentModel.DataAnnotations;

namespace Shared.ValidationAttributes
{
    public class ValidDateAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value == null)
            {
                ErrorMessage = "Birth date is required";
                return false;
            }
            if (value is DateOnly date)
            {
                ErrorMessage = "Birth date must be in the past";
                return date < DateOnly.FromDateTime(DateTime.Now);
            }
            ErrorMessage = "Invalid date format";
            return false;
        }
    }
}
