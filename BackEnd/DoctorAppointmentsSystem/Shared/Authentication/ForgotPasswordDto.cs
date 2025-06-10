using System.ComponentModel.DataAnnotations;

namespace Shared.Authentication
{
    public class ForgotPasswordDto
    {
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
    }
}