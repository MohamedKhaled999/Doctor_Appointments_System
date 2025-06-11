using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOs.Admin_Dashboard
{
    public class DashboardDataDTO
    {
        public DashboardOverviewDTO Overview { get; set; } = new DashboardOverviewDTO();
        public List<MonthlyStatsDTO> MonthlyStats { get; set; } = new List<MonthlyStatsDTO>();
        public List<SpecialtyDistributionDTO> SpecialtyDistribution { get; set; } = new List<SpecialtyDistributionDTO>();
        public List<AppointmentStatusDTO> AppointmentStatus { get; set; } = new List<AppointmentStatusDTO>();
        public List<TopDoctorDTO> TopDoctors { get; set; } = new List<TopDoctorDTO>();
        public List<UnApprovedDoctorDTO> UnApprovedDoctors { get; set; } = new List<UnApprovedDoctorDTO>();
        public List<RecentAppointmentDTO> RecentAppointments { get; set; } = new List<RecentAppointmentDTO>();
    }
}
