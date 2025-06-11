using Domain.Contracts;
using System.Linq.Expressions;

namespace Services.Specifications.Appointment
{
    internal class AppointmentPatientDoctorSpecifications : SpecificationsBase<Domain.Models.Appointment>
    {
        public AppointmentPatientDoctorSpecifications(Expression<Func<Domain.Models.Appointment, bool>> criteria) : base(criteria)
        {
            AddInclude(a => a.DoctorReservation.Doctor);
            AddInclude(a => a.Patient);
        }
    }
}
