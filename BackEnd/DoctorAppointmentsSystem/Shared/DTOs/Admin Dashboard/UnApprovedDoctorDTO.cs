using Shared.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOs.Admin_Dashboard
{
    public class UnApprovedDoctorDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string About { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public Gender Gender { get; set; }
        public float? Lat { get; set; }
        public float? Lng { get; set; }
    }
}
