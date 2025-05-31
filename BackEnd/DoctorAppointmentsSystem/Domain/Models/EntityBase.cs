using System.ComponentModel.DataAnnotations;

namespace Domain.Models
{
    public abstract class EntityBase<T>
    {
        [Key]
        public T Id { get; set; }
    }
}
