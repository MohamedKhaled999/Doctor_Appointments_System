using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Data.Configurations
{
    internal class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder
                .HasIndex(o => new { o.PatientId, o.DoctorReservationId })
                .IsUnique();

            builder
                .HasOne(o => o.Patient)
                .WithMany(p => p.Orders)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasOne(o => o.DoctorReservation)
                .WithMany(p => p.Orders)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
