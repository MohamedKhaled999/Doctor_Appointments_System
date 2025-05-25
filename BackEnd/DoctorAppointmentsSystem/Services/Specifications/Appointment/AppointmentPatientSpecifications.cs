using Domain.Contracts;
using System.Linq.Expressions;

namespace Services.Specifications.Appointment
{
    internal class AppointmentPatientSpecifications : SpecificationsBase<Domain.Models.Appointment>
    {
        public AppointmentPatientSpecifications(Expression<Func<Domain.Models.Appointment, bool>> criteria) : base(criteria)
        {
            AddInclude(a => a.Patient);
        }
    }
}
