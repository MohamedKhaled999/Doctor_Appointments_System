using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOs.Admin_Dashboard
{
    public class DashboardDataDTO
    {
        public DashboardOverview Overview { get; set; } = new DashboardOverview();
        public List<MonthlyStats> MonthlyStats { get; set; } = new List<MonthlyStats>();
        public List<SpecialtyDistribution> SpecialtyDistribution { get; set; } = new List<SpecialtyDistribution>();
        public List<AppointmentStatus> AppointmentStatus { get; set; } = new List<AppointmentStatus>();
        public List<TopDoctor> TopDoctors { get; set; } = new List<TopDoctor>();
        public List<RecentAppointment> RecentAppointments { get; set; } = new List<RecentAppointment>();
    }
}
