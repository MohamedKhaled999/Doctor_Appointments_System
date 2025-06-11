using System.Net;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Services.Abstraction;

namespace Presentation.Caching
{
    public class RedisCachingAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var cachingService = context.HttpContext.RequestServices.GetRequiredService<IServiceManager>().CachingService;
            string cacheKey = GenerateCashKey(context.HttpContext.Request);
            var result = cachingService.GetCachedValue(cacheKey);
            if (result != null)
            {
                context.Result = new ContentResult
                {
                    Content = result,
                    ContentType = "Application/Json",
                    StatusCode = (int)HttpStatusCode.OK
                };
                return;
            }
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var cachingService = context.HttpContext.RequestServices.GetRequiredService<IServiceManager>().CachingService;
            string cacheKey = GenerateCashKey(context.HttpContext.Request);
            if (context.Result is OkObjectResult okObject)
            {
                cachingService.SetCachedValue(cacheKey, okObject, TimeSpan.FromHours(1));
            }
        }

        private string GenerateCashKey(HttpRequest request)
        {
            var KeyBuilder = new StringBuilder();
            KeyBuilder.Append(request.Path);
            foreach (var item in request.Query.OrderBy(q => q.Key))
            {
                KeyBuilder.Append($"{item.Key}--{item.Value}");
            }
            return KeyBuilder.ToString();
        }
    }
}