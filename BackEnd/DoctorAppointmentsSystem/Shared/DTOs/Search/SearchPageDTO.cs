using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOs.Search
{
    public class SearchPageDTO
    {
        public int TotalPageNumber { get; set; }
        public List<DoctorSearchDTO> Doctors { get; set; } = new List<DoctorSearchDTO>();
    }
}
