using DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using vezeetaApplicationAPI.Models;

namespace Persistence
{


    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<AppUser>(options)
    {
        public DbSet<Order> Orders { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Specialty> Specialties { get; set; }
        public DbSet<DoctorReservation> DoctorReservations { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Review> Reviews { get; set; }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //    => optionsBuilder.UseSqlServer("Server = .; Database = MVCProjTest2; Integrated Security = True; Encrypt = False");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Ignore<Person>();
            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.Specialty)
                .WithMany(s => s.Doctors)
                .HasForeignKey(d => d.SpecialtyID);

            modelBuilder.Entity<DoctorReservation>()
                .HasOne(dr => dr.Doctor)
                .WithMany(d => d.DoctorReservations)
                .HasForeignKey(dr => dr.DoctorID);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.DoctorReservation)
                .WithMany(dr => dr.Appointments)
                .HasForeignKey(a => a.DoctorReservationID)
                .OnDelete(deleteBehavior: DeleteBehavior.SetNull);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(deleteBehavior: DeleteBehavior.NoAction);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Patient)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PatientID)
                .OnDelete(deleteBehavior: DeleteBehavior.NoAction);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Doctor)
                .WithMany(d => d.Reviews)
                .HasForeignKey(r => r.DoctorID);

            modelBuilder.Entity<Order>()
                        .HasIndex(o => new { o.PatientId, o.DoctorReservationId })
                        .IsUnique();

            modelBuilder.Entity<Order>()
                        .HasOne(o => o.Patient)
                        .WithMany(p => p.Orders)
                        .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Order>()
                        .HasOne(o => o.DoctorReservation)
                        .WithMany(p => p.Orders)
                        .OnDelete(DeleteBehavior.SetNull);
        }
    }

}
