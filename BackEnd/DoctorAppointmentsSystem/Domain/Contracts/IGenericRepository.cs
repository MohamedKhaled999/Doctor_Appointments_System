using Domain.Models;

namespace Domain.Contracts
{
    public interface IGenericRepository<TEntity, TKey> where TEntity : EntityBase<TKey>
    {
        public Task<List<TEntity>?> GetAllAsync();
        public Task<List<TEntity>> GetAllWithSpecificationsAsync(Specifications<TEntity> specifications);
        public Task<TEntity?> GetByID(TKey id);
        public Task AddAsync(TEntity entity);
        public void Update(TEntity entity);
        public void Delete(TEntity entity);
    }
}
