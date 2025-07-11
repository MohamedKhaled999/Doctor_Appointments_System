using Microsoft.AspNetCore.Mvc;
using Presentation.Caching;
using Services.Abstraction;

namespace Presentation.Controllers
{
    public class SpecialtiesController(IServiceManager serviceManager) : ApiController
    {
        [HttpGet]
        [RedisCaching]
        public async Task<IActionResult> GetAllSpecialties()
        {
            var specialties = await serviceManager.SpecialtyService.GetAllSpecialties();
            if (specialties == null)
                return NotFound();
            return Ok(specialties);
        }
    }
}
