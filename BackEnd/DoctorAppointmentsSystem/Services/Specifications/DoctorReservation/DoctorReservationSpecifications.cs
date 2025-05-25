using Domain.Contracts;
using System.Linq.Expressions;

namespace Services.Specifications.DoctorReservation
{
    internal class DoctorReservationSpecifications : SpecificationsBase<Domain.Models.DoctorReservation>
    {
        public DoctorReservationSpecifications(Expression<Func<Domain.Models.DoctorReservation, bool>> criteria) : base(null)
        {
            AddInclude(r => r.Doctor);
        }
    }
}
