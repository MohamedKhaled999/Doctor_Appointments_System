using Domain.Contracts;
using Domain.Models;
using Services.Abstraction;
using Services.Abstraction.Orchestrators;
using Shared.DTOs.Admin_Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Orchestrators
{
    public class AdminOrchestrator : IAdminOrchestrator
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IServiceManager _serviceManager;
        public AdminOrchestrator(IUnitOfWork unitOfWork, IServiceManager serviceManager)
        {
            _unitOfWork = unitOfWork;
            _serviceManager = serviceManager;
        }
        public async Task<DashboardOverview> GetDashboardOverviewAsync()
        {

            return new DashboardOverview
            {
                TotalDoctors = _unitOfWork.GetRepository<Doctor, int>().GetCount(),
                TotalPatients = _unitOfWork.GetRepository<Patient, int>().GetCount(),
                TotalAppointments = _unitOfWork.GetRepository<Appointment, int>().GetCount(),
                MonthlyRevenue = (decimal)await GetMonthlyRevenue(DateTime.Now.Month),
                GrowthRate = (decimal)await GetGrowthRate(),
                AverageRating = await _serviceManager.ReviewService.GetAvgRatings()
            };

        }
        public async Task<List<MonthlyStats>> GetMonthlyStatsAsync()
        {
            var MSList = new List<MonthlyStats>();
            for (int i = DateTime.MinValue.Month; i <= DateTime.Now.Month; i++)
            {
                var monthlyStats = new MonthlyStats
                {
                    Month = new DateTime(DateTime.Now.Year, i, 1).ToString("MMMM"),
                    Appointments = (await GetMonthAppoiments(i)).Count,
                    Revenue = (decimal)await GetMonthlyRevenue(i),
                    Patients = (await GetMonthAppoiments(i)).Select(a => a.PatientId).Distinct().Count()
                };
                MSList.Add(monthlyStats);
            }

            return MSList;
        }
        public async Task<List<SpecialtyDistribution>> GetSpecialtyDistributionAsync()
        {
            return (await _serviceManager.HomeService.GetHomeData()).Specialties.Select(s => new SpecialtyDistribution
            {
                Name = s.Name,
                Value = s.NumberOfDoctors
            }).ToList();
        }
        public async Task<List<AppointmentStatus>> GetAppointmentStatusAsync()
        {
            var AppointmentStatusList = new List<AppointmentStatus>();
            SpecificationsBase<Appointment> spec = new SpecificationsBase<Appointment>(null);
            spec.AddInclude(a => a.DoctorReservation);
            var appointments = await _unitOfWork.GetRepository<Appointment, int>().GetAllAsync(spec);
            if (appointments == null || !appointments.Any())
                return new List<AppointmentStatus>();
            var totalAppointments = appointments.Count();
            var completedAppointments = appointments.Count(a => a.DoctorReservation.EndTime < DateTime.Now && a.Canceled == false);
            var pendingAppointments = appointments.Count(a => a.DoctorReservation.StartTime > DateTime.Now && a.Canceled == false);
            var cancelledAppointments = appointments.Count(a => a.Canceled == true);
            AppointmentStatusList.Add(new AppointmentStatus()
            {
                Status = "Completed",
                Count = completedAppointments,
            });
            AppointmentStatusList.Add(new AppointmentStatus()
            {
                Status = "Pending",
                Count = pendingAppointments,
            });
            AppointmentStatusList.Add(new AppointmentStatus()
            {
                Status = "Cancelled",
                Count = cancelledAppointments,
            });
            AppointmentStatusList.Add(new AppointmentStatus()
            {
                Status = "Total",
                Count = totalAppointments,
            });
            return AppointmentStatusList;
        }
        public async Task<List<TopDoctor>> GetTopDoctorsAsync()
        {
            var topDoctors = new List<TopDoctor>();
            SpecificationsBase<Doctor> spec = new SpecificationsBase<Doctor>(null);
            spec.AddInclude(d => d.Specialty);
            var doctors = await _unitOfWork.GetRepository<Doctor, int>().GetAllAsync(spec);
            if (doctors == null || !doctors.Any())
                return new List<TopDoctor>();
            foreach (var doctor in doctors)
            {
                topDoctors.Add(new TopDoctor
                {
                    Id = doctor.Id,
                    Name = $"{doctor.FirstName} {doctor.LastName}",
                    Specialty = doctor.Specialty.Name,
                    Rating = (decimal)await _serviceManager.ReviewService.GetDoctorAverageRating(doctor.Id),
                    Appointments = _serviceManager.AppointmentService.GetDoctorAppointmentsCount(doctor.Id),
                    Revenue = (decimal)await _serviceManager.TransactionService.GetDoctorRevenue(doctor.Id)
                });
            }
            return topDoctors.OrderByDescending(d => d.Revenue).Take(10).ToList();
        }
        public async Task<List<RecentAppointment>> GetRecentAppointmentsAsync()
        {
            var recentAppointments = new List<RecentAppointment>();
            SpecificationsBase<Appointment> spec = new SpecificationsBase<Appointment>(null);
            spec.AddInclude(a => a.Patient);
            spec.AddInclude(a => a.DoctorReservation.Doctor);
            spec.SetOrderByDescending(a => a.DoctorReservation.StartTime);
            spec.ApplyPagination(1, 10);
            var appointments = await _unitOfWork.GetRepository<Appointment, int>().GetAllAsync(spec);
            if (appointments == null || !appointments.Any())
                return new List<RecentAppointment>();
            foreach (var appointment in appointments)
            {
                recentAppointments.Add(new RecentAppointment
                {
                    Id = appointment.Id,
                    Patient = $"{appointment.Patient.FirstName} {appointment.Patient.LastName}",
                    Doctor = $"{appointment.DoctorReservation.Doctor.FirstName} {appointment.DoctorReservation.Doctor.LastName}",
                    Date = appointment.DoctorReservation.StartTime.Date.ToShortDateString(),
                    Time = appointment.DoctorReservation.StartTime.ToShortTimeString(),
                    Status = appointment.Canceled ? "Cancelled" : "Pending"
                });
            }
            return recentAppointments;
        }
        public async Task<DashboardDataDTO> GetDashboardDataAsync()
        {
            return new DashboardDataDTO
            {
                Overview = await GetDashboardOverviewAsync(),
                MonthlyStats = await GetMonthlyStatsAsync(),
                SpecialtyDistribution = await GetSpecialtyDistributionAsync(),
                AppointmentStatus = await GetAppointmentStatusAsync(),
                TopDoctors = await GetTopDoctorsAsync(),
                RecentAppointments = await GetRecentAppointmentsAsync()
            };
        }

        private async Task<List<Appointment>> GetMonthAppoiments(int Month)
        {
            SpecificationsBase<Appointment> spec = new SpecificationsBase<Appointment>
                (a => a.DoctorReservation.StartTime.Month == Month);
            spec.IncludeExpressions.Add(a => a.Transaction);
            var appointmentsThisMonth = await _unitOfWork.GetRepository<Appointment, int>().GetAllAsync(spec);
            if (appointmentsThisMonth == null || !appointmentsThisMonth.Any())
                return new List<Appointment>();
            return appointmentsThisMonth.ToList();
        }
        private async Task<double> GetMonthlyRevenue(int Month)
        {
            var appointmentsThisMonth = await GetMonthAppoiments(Month);
            if (appointmentsThisMonth == null || !appointmentsThisMonth.Any())
                return 0d;
            return appointmentsThisMonth.Select(a => a.Transaction.Amount).Sum() * .05;
        }
        private async Task<double> GetGrowthRate()
        {
            var currentMonth = DateTime.Now.Month;
            var previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
            var currentMonthRevenue = await GetMonthlyRevenue(currentMonth);
            var previousMonthRevenue = await GetMonthlyRevenue(previousMonth);

            if (previousMonthRevenue == 0)
                return currentMonthRevenue; // Avoid division by zero

            return ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

        }
        //private string GetMonthName(int monthNumber)
        //{
        //    return new DateTime(DateTime.Now.Year, monthNumber, 1).ToString("MMMM");
        //}

    }
}
