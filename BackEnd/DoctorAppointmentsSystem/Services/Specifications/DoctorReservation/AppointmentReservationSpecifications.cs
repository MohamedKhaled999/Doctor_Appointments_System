using Domain.Contracts;
using System.Linq.Expressions;

namespace Services.Specifications.DoctorReservation
{
    internal class AppointmentReservationSpecifications : SpecificationsBase<Domain.Models.DoctorReservation>
    {
        public AppointmentReservationSpecifications(Expression<Func<Domain.Models.DoctorReservation, bool>> criteria) : base(null)
        {
            AddInclude(r => r.Appointments);
        }
    }
}
