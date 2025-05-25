using Domain.Contracts;
using Services.Abstraction;

namespace Services
{
    internal class TransactionService : ITransactionService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TransactionService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        public Task AddAsync(int patientId, int doctorId, int amount)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(int id, int amount)
        {
            throw new NotImplementedException();
        }
    }
}
