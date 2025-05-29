using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;

namespace Presentation.Controllers
{
    public class HomeController : ApiController
    {
        private readonly IServiceManager _serviceManager;

        public HomeController(IServiceManager serviceManager) => _serviceManager = serviceManager;

        public async Task<IActionResult> Index()
        {
            var homeData = await _serviceManager.HomeService.GetHomeData();
            return Ok(homeData);
        }
    }
}
