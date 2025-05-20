using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Data.Configurations
{
    internal class DoctorReservationConfiguration : IEntityTypeConfiguration<DoctorReservation>
    {
        public void Configure(EntityTypeBuilder<DoctorReservation> builder)
        {
            builder
                .HasOne(dr => dr.Doctor)
                .WithMany(d => d.DoctorReservations)
                .HasForeignKey(dr => dr.DoctorID);
        }
    }
}
