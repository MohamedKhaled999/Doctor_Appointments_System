using Shared.DTOs.Transaction;

namespace Services.Abstraction
{
    public interface ITransactionService
    {
        Task<TransactionDTO?> GetByIdAsync(int id);
        Task AddAsync(int patientId, int doctorId, int amount);
        Task UpdateAsync(int id, int amount);
        Task DeleteAsync(int id);
    }
}
