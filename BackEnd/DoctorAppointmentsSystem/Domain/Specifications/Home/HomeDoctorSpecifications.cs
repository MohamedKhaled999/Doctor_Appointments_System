using Domain.Contracts;
using Domain.Models;

namespace Domain.Specifications.Home
{
    public class HomeDoctorSpecifications : SpecificationsBase<Doctor>
    {
        public HomeDoctorSpecifications() : base(null)
        {
            AddInclude(d => d.Specialty);
            SetOrderByDescending(d => d.OverallRating);
        }
    }
}
