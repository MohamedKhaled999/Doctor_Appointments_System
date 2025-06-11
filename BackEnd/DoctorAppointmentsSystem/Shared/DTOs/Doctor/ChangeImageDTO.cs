using Microsoft.AspNetCore.Http;
using Shared.ValidationAttributes;

namespace Shared.DTOs.Doctor
{
    public class ChangeImageDTO
    {
        public int ID { get; set; }
        [MaxSize(2, ErrorMessage = "Maximum allowed size is 2 MB")]
        [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg" })]
        public IFormFile File { get; set; }
    }
}
