using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOs.Admin_Dashboard
{
    public class SpecialtyDistributionDTO
    {
        public string Name { get; set; } = string.Empty;
        public int Value { get; set; }
        public string Color { get; set; } = string.Empty;
    }
}
