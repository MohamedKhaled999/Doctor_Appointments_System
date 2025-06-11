using Shared.DTOs.Home;

namespace Services.Abstraction
{
    public interface IHomeService
    {
        public Task<HomeDTO> GetHomeData();
    }
}
