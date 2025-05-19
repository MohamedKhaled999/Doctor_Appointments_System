namespace Domain.Models
{
    public abstract class EntityBase<T>
    {
        public T Id { get; set; }
    }
}
