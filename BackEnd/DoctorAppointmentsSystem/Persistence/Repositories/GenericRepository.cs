using Domain.Contracts;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Repositories
{
    public class GenericRepository<TEntity, TKey> : IGenericRepository<TEntity, TKey> where TEntity : EntityBase<TKey>
    {
        private readonly AppDbContext _context;
        public GenericRepository(AppDbContext context)
        {
            _context = context;
        }
        public virtual async void Add(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));
            await _context.Set<TEntity>().AddAsync(entity);
        }

        public virtual async void Delete(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));
            _context.Set<TEntity>().Remove(entity);
        }
        public virtual async Task<List<TEntity>> GetAll()
        {
            var entities = await _context.Set<TEntity>().ToListAsync();
            return entities;
        }

        public virtual async Task<List<TEntity>> GetAll(SpecificationsBase<TEntity> specifications)
        {
            //var query = _context.Set<TEntity>().AsQueryable();
            //if (specifications.Criteria != null)
            //    query = query.Where(specifications.Criteria);
            //if (specifications.IncludeExpressions != null)
            //    foreach (var include in specifications.IncludeExpressions)
            //        query = query.Include(include);
            //if (specifications.OrderBy != null)
            //    query = query.OrderBy(specifications.OrderBy);
            //if (specifications.OrderByDescending != null)
            //    query = query.OrderByDescending(specifications.OrderByDescending);
            //if (specifications.IsPaginated)
            //    query = query.Skip(specifications.Skip).Take(specifications.Take);
            //var entities = query.ToList();
            var query = SpecificationFactory.BuildQuery(_context.Set<TEntity>(), specifications);
            var entities = query.ToList();
            return await Task.FromResult(entities);

        }

        public virtual async Task<TEntity> GetByID(TKey id)
        {
            var entity = _context.Set<TEntity>().Find(id);
            //if (entity == null)
            //    throw new KeyNotFoundException($"Entity with id {id} not found");
            return await Task.FromResult(entity);
        }

        public virtual async void Update(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));
            _context.Set<TEntity>().Update(entity);
        }
    }
}
