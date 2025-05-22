using Domain.Contracts;
using System.Linq.Expressions;

namespace Domain.Specifications.Appointment
{
    public class AppointmentPatientSpecifications : SpecificationsBase<Models.Appointment>
    {
        public AppointmentPatientSpecifications(Expression<Func<Models.Appointment, bool>> criteria,
                                                int pageIndex = 1,
                                                int pageSize = 20) : base(criteria)
        {
            ApplyPagination(pageIndex, pageSize);
        }
    }
}
