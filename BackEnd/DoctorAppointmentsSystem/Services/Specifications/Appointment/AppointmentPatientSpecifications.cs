using Domain.Contracts;
using System.Linq.Expressions;

namespace Services.Specifications.Appointment
{
    internal class AppointmentPatientSpecifications : SpecificationsBase<Domain.Models.Appointment>
    {
        public AppointmentPatientSpecifications(Expression<Func<Domain.Models.Appointment, bool>> criteria,
                                                int pageIndex = 1,
                                                int pageSize = 20) : base(criteria)
        {
            ApplyPagination(pageIndex, pageSize);
        }
    }
}
