using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOs.Admin_Dashboard
{
    public class MonthlyStats
    {
        public string Month { get; set; } = string.Empty;
        public int Appointments { get; set; }
        public decimal Revenue { get; set; }
        public int Patients { get; set; }
    }
}
