using Shared.DTOs.Transaction;

namespace Services.Abstraction
{
    public interface ITransactionService
    {
        Task<TransactionDTO?> GetByIdAsync(int id);
        Task<string> GetPaymentId(int transactionId);
        Task AddAsync(int patientId, int doctorId, int amount, string paymentId);
        Task UpdateAsync(int id, int amount);
        Task DeleteAsync(int id);
    }
}
