using Shared.Enums;

namespace Shared.DTOs.Search
{
    public class FilterSearchDTO
    {
        public int PageNum { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string Name { get; set; } = string.Empty;
        public int Specialty { get; set; } = 0;
        public Governorate Governorate { get; set; } = Governorate.All;
        public Gender Gender { get; set; } = Gender.All;
        public int WaitingTime { get; set; } = 60;
        public double MinPrice { get; set; } = 0;
        public double MaxPrice { get; set; } = 10000;
    }
}
