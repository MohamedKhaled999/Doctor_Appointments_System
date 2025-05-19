using Domain.Models;

namespace Domain.Contracts
{
    public interface IGenericRepository<TEntity, TKey> where TEntity : EntityBase<TKey>
    {
        public Task<List<TEntity>> GetAll();
        public Task<TEntity> GetByID(TKey id);
        public void Add(TEntity entity);
        public void Update(TEntity entity);
        public void Delete(TEntity entity);
    }
}
