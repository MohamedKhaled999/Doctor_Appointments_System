using System.ComponentModel.DataAnnotations;

namespace Shared.Authentication
{
    public class ConfirmEmailDto
    {
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Token is required.")]
        public string Token { get; set; } 
       
    }
}