using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Data.Configurations
{
    internal class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder
                .HasOne(t => t.Patient)
                .WithMany(p => p.Transactions)
                .OnDelete(DeleteBehavior.SetNull);

            builder
                .HasOne(t => t.Doctor)
                .WithMany(d => d.Transactions)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
