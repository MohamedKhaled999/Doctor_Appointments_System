using Domain.Contracts;
using Domain.Models;
using System.Linq.Expressions;

namespace Domain.Specifications
{
    public class AppointmentPatientSpecifications : SpecificationsBase<Appointment>
    {
        public AppointmentPatientSpecifications(Expression<Func<Appointment, bool>> criteria) : base(criteria)
        {
        }
    }
}
