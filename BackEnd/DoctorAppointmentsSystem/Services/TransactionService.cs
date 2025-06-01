using AutoMapper;
using Domain.Contracts;
using Domain.Models;
using Services.Abstraction;
using Shared.DTOs.Transaction;

namespace Services
{
    internal class TransactionService : ITransactionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TransactionService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<TransactionDTO?> GetByIdAsync(int id)
        {
            var transaction = await _unitOfWork.GetRepository<Transaction, int>().GetByIdAsync(id);
            if (transaction == null)
                return null;
            return _mapper.Map<TransactionDTO>(transaction);
        }

        public async Task<string> GetPaymentId(int transactionId)
        {
            return (await GetByIdAsync(transactionId)).PaymentId;
        }

        public async Task<int?> GetByPaymentId(string paymentId)
        {
            var specs = new SpecificationsBase<Transaction>(t => t.PaymentId == paymentId);
            var transaction = (await _unitOfWork.GetRepository<Transaction, int>().GetAllAsync(specs)).FirstOrDefault();
            if (transaction == null)
                return null;
            return transaction.Id;
        }

        public async Task AddAsync(int patientId, int doctorId, int amount, string paymentId)
        {
            var transaction = new Transaction()
            {
                PatientId = patientId,
                DoctorId = doctorId,
                Amount = amount,
                TimeStamp = DateTime.Now,
                PaymentId = paymentId
            };
            await _unitOfWork.GetRepository<Transaction, int>().AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(int id, int amount)
        {
            var transaction = _mapper.Map<Transaction>(await GetByIdAsync(id));
            if (transaction == null)
                throw new ArgumentNullException($"Transaction with ID {id} doesn't exist");
            transaction.Amount = amount;
            _unitOfWork.GetRepository<Transaction, int>().Update(transaction);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var transaction = await _unitOfWork.GetRepository<Transaction, int>().GetByIdAsync(id);
            if (transaction == null)
                throw new ArgumentNullException($"Transaction with ID {id} doesn't exist");
            _unitOfWork.GetRepository<Transaction, int>().Delete(transaction);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
