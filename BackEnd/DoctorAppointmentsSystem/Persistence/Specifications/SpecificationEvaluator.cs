using Domain.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Specifications
{
    internal class SpecificationEvaluator<T> where T : class
    {
        public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, Specifications<T> specifications)
        {
            var query = inputQuery;
            query = specifications.IncludeExpressions.Aggregate(query, (input, include) => input.Include(include));

            if (specifications.Criteria != null)
                query = query.Where(specifications.Criteria);

            if (specifications.IsPaginated)
                query = query.Skip(specifications.Skip).Take(specifications.Take);

            if (specifications.OrderBy != null)
                query = query.OrderBy(specifications.OrderBy);

            if (specifications.OrderByDescending != null)
                query = query.OrderByDescending(specifications.OrderByDescending);
            return query;
        }
    }
}
