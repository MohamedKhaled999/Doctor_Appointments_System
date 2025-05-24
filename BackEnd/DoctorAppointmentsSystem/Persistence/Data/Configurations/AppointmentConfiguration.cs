using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.Data.Configurations
{
    internal class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder
                .HasOne(a => a.DoctorReservation)
                .WithMany(dr => dr.Appointments)
                .HasForeignKey(a => a.DoctorReservationID)
                .OnDelete(deleteBehavior: DeleteBehavior.Cascade);

            builder
                .HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(deleteBehavior: DeleteBehavior.NoAction);
        }
    }
}
