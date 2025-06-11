using Microsoft.AspNetCore.Mvc.Filters;
using Services.Abstraction;
using System.Security.Claims;

namespace Presentation.ActionFilters
{
    internal class ApprovedDoctorFilter : IActionFilter
    {
        private readonly IServiceManager _serviceManager;
        public ApprovedDoctorFilter(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }
        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!IsDoctorApproved(context).Result)
            {
                throw new UnauthorizedAccessException("This doctor is not approved yet. Please contact support for assistance.");
            }
        }
        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Logic after action execution if needed
        }
        private async Task<bool> IsDoctorApproved(ActionExecutingContext context)
        {
            var AppId = int.Parse(context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            return await _serviceManager.DoctorService.IsDoctorUserApproved(AppId);
        }
    }

}
