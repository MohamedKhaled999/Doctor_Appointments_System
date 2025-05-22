using Domain.Contracts;
using Domain.Models;
using System.Linq.Expressions;

namespace Domain.Specifications.Appointment
{
    public class AppointmentReviewSpecifications : SpecificationsBase<Review>
    {
        public AppointmentReviewSpecifications(Expression<Func<Review, bool>> criteria) : base(criteria)
        {
        }
    }
}
