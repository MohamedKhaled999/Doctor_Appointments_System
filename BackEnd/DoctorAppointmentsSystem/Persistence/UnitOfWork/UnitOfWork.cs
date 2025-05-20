using Domain.Contracts;
using Domain.Models;
using Persistence.Data;
using Persistence.Repositories;
using System.Collections.Concurrent;

namespace Persistence.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly AppDbContext _context;
        private readonly ConcurrentDictionary<Type, object> _repositories;
        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            _repositories = new ConcurrentDictionary<Type, object>();
        }
        public IGenericRepository<TEntity, TKey> GetRepository<TEntity, TKey>() where TEntity : EntityBase<TKey>
        {
            var key = typeof(IGenericRepository<TEntity, TKey>);
            var valueFactory = new Lazy<object>(new GenericRepository<TEntity, TKey>(_context));
            return (IGenericRepository<TEntity, TKey>)_repositories.GetOrAdd(key, _ => valueFactory);
        }
        public async Task<int> SaveChangesAsync()
            => await _context.SaveChangesAsync();

        public void Dispose()
            => _context.Dispose();
    }
}
