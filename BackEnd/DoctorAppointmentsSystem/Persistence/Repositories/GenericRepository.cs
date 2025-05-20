using Domain.Contracts;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories
{
    public class GenericRepository<TEntity, TKey> : IGenericRepository<TEntity, TKey> where TEntity : EntityBase<TKey>
    {
        private readonly AppDbContext _context;
        public GenericRepository(AppDbContext context) => _context = context;

        public virtual async Task AddAsync(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));
            await _context.Set<TEntity>().AddAsync(entity);
        }

        public virtual void Delete(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));
            _context.Set<TEntity>().Remove(entity);
        }

        public virtual async Task<List<TEntity>> GetAllAsync()
        {
            var entities = await _context.Set<TEntity>().ToListAsync();
            return entities;
        }

        public virtual int GetCount(SpecificationsBase<TEntity> specifications)
            => SpecificationFactory.BuildQuery(_context.Set<TEntity>(), specifications).Count();

        public virtual async Task<List<TEntity>> GetAllAsync(SpecificationsBase<TEntity> specifications)
        {
            var query = SpecificationFactory.BuildQuery(_context.Set<TEntity>(), specifications);
            return await query.ToListAsync();
        }

        public virtual async Task<TEntity?> GetByID(TKey id)
        {
            return await _context.Set<TEntity>().FindAsync(id);
        }

        public virtual void Update(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));
            _context.Set<TEntity>().Update(entity);
        }
    }
}
