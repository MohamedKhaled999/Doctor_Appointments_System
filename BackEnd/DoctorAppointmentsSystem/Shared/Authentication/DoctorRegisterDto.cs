using Microsoft.AspNetCore.Http;
using Shared.Enums;
using Shared.ValidationAttributes;
using System.ComponentModel.DataAnnotations;

namespace Shared.Authentication
{
    public record DoctorRegisterDto : RegisterDto
    {
        [Display(Name = "Specialty")]
        public int SpecialtyID { get; set; }
        [Range(0, double.MaxValue)]
        public int Fees { get; set; }
        [Range(0, 60)]
        [DataType(DataType.Duration)]
        [Display(Name = "Waiting Time")]
        [RegularExpression(@"^[0-9]*$", ErrorMessage = "Waiting Time must be a number")]
        public int WaitingTime { get; set; }
        [Display(Name = "Profile Image")]
        [MaxSize(2, ErrorMessage = "Maximum allowed size is 2 MB")]
        [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg" })]
        public IFormFile Image { get; set; }
        [DataType(DataType.MultilineText)]
        [StringLength(500, ErrorMessage = "About Doctor must be less than 500 characters")]
        public string? ImageURL { get; set; }
        public string About { get; set; }
        [MaxLength(200)]
        public string Address { get; set; }
        public Gender Gender { get; set; }
        public float Lat { get; set; } = 30.0594629f;
        public float Lng { get; set; } = 31.3406953f;
    }
}
