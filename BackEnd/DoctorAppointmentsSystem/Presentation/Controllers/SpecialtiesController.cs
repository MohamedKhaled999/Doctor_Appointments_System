using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;

namespace Presentation.Controllers
{
    public class SpecialtiesController(IServiceManager serviceManager) : ApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetAllSpecialties()
        {
            var specialties = await serviceManager.SpecialtyService.GetAllSpecialties();
            return Ok(specialties);
        }
    }
}
