using Domain.Contracts;
using Domain.Models;
using System.Linq.Expressions;

namespace Domain.Specifications
{
    public class DoctorsPerSpecialtySpecifications : SpecificationsBase<Doctor>
    {
        public DoctorsPerSpecialtySpecifications(Expression<Func<Doctor, bool>> criteria) : base(criteria)
        {
        }
    }
}
