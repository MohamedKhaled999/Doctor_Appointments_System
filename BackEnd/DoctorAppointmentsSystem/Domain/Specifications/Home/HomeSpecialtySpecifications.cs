using Domain.Contracts;
using Domain.Models;
using System.Linq.Expressions;

namespace Domain.Specifications.Home
{
    public class HomeSpecialtySpecifications : SpecificationsBase<Doctor>
    {
        public HomeSpecialtySpecifications(Expression<Func<Doctor, bool>> criteria) : base(criteria)
        {
        }
    }
}
