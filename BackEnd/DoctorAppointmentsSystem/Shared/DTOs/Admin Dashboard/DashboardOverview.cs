using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOs.Admin_Dashboard
{
    public class DashboardOverview
    {
        public int TotalDoctors { get; set; }
        public int TotalPatients { get; set; }
        public int TotalAppointments { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public decimal GrowthRate { get; set; }
        public decimal AverageRating { get; set; }
    }
}
