using AutoMapper;
using Domain.Models;
using Shared.DTOs.Transaction;

namespace Services.MappingProfiles
{
    internal class TransactionMappingProfile : Profile
    {
        public TransactionMappingProfile()
        {
            CreateMap<Transaction, TransactionDTO>().ReverseMap();
        }
    }
}
