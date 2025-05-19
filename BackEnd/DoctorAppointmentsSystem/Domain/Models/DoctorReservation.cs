using Domain.Models;
using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public class DoctorReservation : EntityBase<int>
    {
        public int DoctorID { get; set; }
        [DataType(DataType.Time)]
        public DateTime StartTime { get; set; }
        [DataType(DataType.Time)]
        public DateTime EndTime { get; set; }
        public int MaxReservation { get; set; }
        public virtual Doctor Doctor { get; set; }
        public virtual ICollection<Order>? Orders { get; set; }
        public virtual ICollection<Appointment>? Appointments { get; set; }
    }
}
