using Shared.DTOs.Transaction;

namespace Services.Abstraction
{
    public interface ITransactionService
    {
        Task<TransactionDTO?> GetByIdAsync(int id);
        Task<string> GetPaymentId(int transactionId);
        Task<int> GetByPaymentId(string paymentId);
        Task AddAsync(int patientId, int doctorId, int amount, string paymentId);
        Task UpdateAsync(int id, double amount);
        Task DeleteAsync(int id);
    }
}
