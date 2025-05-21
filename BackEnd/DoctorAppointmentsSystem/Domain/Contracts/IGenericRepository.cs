using Domain.Models;

namespace Domain.Contracts
{
    public interface IGenericRepository<TEntity, TKey> where TEntity : EntityBase<TKey>
    {
        public Task<List<TEntity>> GetAllAsync();
        public Task<TEntity?> GetByIdAsync(TKey id);
        public Task AddAsync(TEntity entity);
        public void Update(TEntity entity);
        public void Delete(TEntity entity);
        public Task<List<TEntity>> GetAllAsync(SpecificationsBase<TEntity> specifications);
        public int GetCount(SpecificationsBase<TEntity> specifications);
    }
}
