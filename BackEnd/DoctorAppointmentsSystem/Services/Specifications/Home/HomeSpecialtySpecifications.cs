using Domain.Contracts;
using Domain.Models;
using System.Linq.Expressions;

namespace Services.Specifications.Home
{
    internal class HomeSpecialtySpecifications : SpecificationsBase<Doctor>
    {
        public HomeSpecialtySpecifications(Expression<Func<Doctor, bool>> criteria) : base(criteria)
        {
        }
    }
}
