using Microsoft.AspNetCore.Identity;

namespace Domain.Models
{
    public class AppUser : IdentityUser<int>
    {
        public virtual Person Person { get; set; }
    }
}
