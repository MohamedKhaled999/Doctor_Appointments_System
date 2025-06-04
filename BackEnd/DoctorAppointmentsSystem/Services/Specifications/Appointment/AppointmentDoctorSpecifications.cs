using Domain.Contracts;
using System.Linq.Expressions;

namespace Services.Specifications.Appointment
{
    internal class AppointmentDoctorSpecifications : SpecificationsBase<Domain.Models.Appointment>
    {
        public AppointmentDoctorSpecifications(Expression<Func<Domain.Models.Appointment, bool>> criteria) : base(criteria)
        {
            AddInclude(a => a.DoctorReservation.Doctor);
        }
    }
}
