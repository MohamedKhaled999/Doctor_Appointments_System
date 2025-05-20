using Domain.Contracts;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;
using Persistence.Specifications;

namespace Persistence.Repositories
{
    public class GenericRepository<TEntity, TKey> : IGenericRepository<TEntity, TKey> where TEntity : EntityBase<TKey>
    {
        protected AppDbContext _context;
        public GenericRepository(AppDbContext context) => _context = context;

        public async Task<List<TEntity>?> GetAllAsync()
            => await _context.Set<TEntity>().AsNoTracking().ToListAsync();

        public async Task<List<TEntity>> GetAllWithSpecificationsAsync(Specifications<TEntity> specifications)
        {
            var query = SpecificationEvaluator<TEntity>.GetQuery(_context.Set<TEntity>(), specifications);
            return await query.ToListAsync();
        }

        public async Task<TEntity?> GetByID(TKey id)
        {
            var res = await _context.Set<TEntity>().FindAsync(id);
            if (res != null)
                _context.Entry(res).State = EntityState.Detached;
            return res;
        }

        public async Task AddAsync(TEntity entity)
            => await _context.Set<TEntity>().AddAsync(entity);

        public void Update(TEntity entity)
            => _context.Set<TEntity>().Update(entity);

        public void Delete(TEntity entity)
            => _context.Set<TEntity>().Remove(entity);
    }
}
