namespace Domain.Models
{
    public class Patient : Person
    {
        public virtual ICollection<Appointment>? Appointments { get; set; }
        public virtual ICollection<Review>? Reviews { get; set; }
    }
}
