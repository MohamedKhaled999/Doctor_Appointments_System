using Domain.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public abstract class Person : EntityBase<int>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        [DataType(DataType.Date)]
        public DateTime BirthDate { get; set; }
        public Governorate Governorate { get; set; }
        public string PhoneNumber { get; set; }
        public int? AppUserID { get; set; }
        public virtual ICollection<Transaction>? Transactions { get; set; }
    }
}
