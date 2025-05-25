using Domain.Contracts;
using System.Linq.Expressions;

namespace Services.Specifications.Appointment
{
    internal class AppointmentPaginationSpecifications : SpecificationsBase<Domain.Models.Appointment>
    {
        public AppointmentPaginationSpecifications(Expression<Func<Domain.Models.Appointment, bool>> criteria,
                                                int pageIndex = 1,
                                                int pageSize = 20) : base(criteria)
        {
            ApplyPagination(pageIndex, pageSize);
        }
    }
}
