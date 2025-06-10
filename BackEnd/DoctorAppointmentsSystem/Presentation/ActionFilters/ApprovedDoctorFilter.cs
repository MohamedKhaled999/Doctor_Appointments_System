using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Services.Abstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

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
                context.HttpContext.Response.StatusCode = 403; 
                context.HttpContext.Response.ContentType = "application/json";
                context.HttpContext.Response.WriteAsync("You are not an approved doctor. Please contact support for assistance.");
                context.Result = new ForbidResult();
                return;
            }
            //context.Result = new OkResult(); 
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
