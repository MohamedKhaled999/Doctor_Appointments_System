using Domain.Contracts;
using Domain.Models;
using System.Linq.Expressions;

namespace Services.Specifications.Appointment
{
    internal class AppointmentReviewSpecifications : SpecificationsBase<Review>
    {
        public AppointmentReviewSpecifications(Expression<Func<Review, bool>> criteria) : base(criteria)
        {
        }
    }
}
