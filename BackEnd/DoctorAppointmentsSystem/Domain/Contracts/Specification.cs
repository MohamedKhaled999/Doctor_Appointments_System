using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Contracts
{
    public class SpecificationBase<T> : SpecificationsBase<T> where T : class
    {
        public SpecificationBase(Expression<Func<T, bool>> criteria) : base(criteria)
        {
        }

    }

}
