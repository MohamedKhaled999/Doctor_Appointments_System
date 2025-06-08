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
        Task<DashboardOverview> GetDashboardOverviewAsync();
        Task<List<MonthlyStats>> GetMonthlyStatsAsync();
        Task<List<SpecialtyDistribution>> GetSpecialtyDistributionAsync();
        Task<List<AppointmentStatus>> GetAppointmentStatusAsync();
        Task<List<TopDoctor>> GetTopDoctorsAsync();
        Task<List<RecentAppointment>> GetRecentAppointmentsAsync();
        Task<DashboardDataDTO> GetDashboardDataAsync();

    }
}
