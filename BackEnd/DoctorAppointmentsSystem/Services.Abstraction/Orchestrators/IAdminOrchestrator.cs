using Shared.DTOs.Admin_Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Abstraction.Orchestrators
{
    public interface IAdminOrchestrator
    {
        Task<DashboardOverviewDTO> GetDashboardOverviewAsync();
        Task<List<MonthlyStatsDTO>> GetMonthlyStatsAsync();
        Task<List<SpecialtyDistributionDTO>> GetSpecialtyDistributionAsync();
        Task<List<AppointmentStatusDTO>> GetAppointmentStatusAsync();
        Task<List<TopDoctorDTO>> GetTopDoctorsAsync();
        Task<List<RecentAppointmentDTO>> GetRecentAppointmentsAsync();
        Task<DashboardDataDTO> GetDashboardDataAsync();

    }
}
