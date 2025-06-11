using Domain.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    internal static class SpecificationFactory
    {
        internal static IQueryable<T> BuildQuery<T>(IQueryable<T> query, SpecificationsBase<T> specification) where T : class
        {
            query = query.AsNoTracking();

            if (specification.Criteria != null)
                query = query.Where(specification.Criteria);

            foreach (var includeExpression in specification.IncludeExpressions)
                query = query.Include(includeExpression);

            if (specification.OrderBy != null)
                query = query.OrderBy(specification.OrderBy);

            else if (specification.OrderByDescending != null)
                query = query.OrderByDescending(specification.OrderByDescending);

            if (specification.IsPaginated)
                query = query.Skip(specification.Skip).Take(specification.Take);

            return query;
        }
    }
}
