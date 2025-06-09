using Microsoft.AspNetCore.Http;
using Shared.Enums;
using Shared.ValidationAttributes;
using System.ComponentModel.DataAnnotations;

namespace Shared.DTOs.Doctor
{
    public class DoctorEditDTO
    {
        public int Id { get; set; }
        [Display(Name = "First Name")]
        [RegularExpression("^[a-zA-Z0-9](?:[a-zA-Z0-9_ -]*[a-zA-Z0-9])?$", ErrorMessage = "Invalid Name Format")]
        public string FirstName { get; set; }
        [Display(Name = "Last Name")]
        [RegularExpression("^[a-zA-Z0-9](?:[a-zA-Z0-9_ -]*[a-zA-Z0-9])?$", ErrorMessage = "Invalid Name Format")]
        public string LastName { get; set; }
        
        [Display(Name = "Phone Number")]
        [RegularExpression("^0\\d{10}$", ErrorMessage = "Invalid Phone Number")]
        public string PhoneNumber { get; set; }
        public Governorate Governorate { get; set; }
        [Display(Name = "Birth Date")]
        //[ValidDate]
        public DateOnly BirthDate { get; set; } = DateOnly.FromDateTime(DateTime.Now.AddDays(-1));
        public string Specialty { get; set; }
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
        public IFormFile? Image { get; set; }
        [DataType(DataType.MultilineText)]
        [StringLength(500, ErrorMessage = "About Doctor must be less than 500 characters")]
        public string About { get; set; }
        [MaxLength(200)]
        public string Address { get; set; }
        public Gender Gender { get; set; }
        public float Lat { get; set; } = 30.0594629f;
        public float Lng { get; set; } = 31.3406953f;
    }
}
