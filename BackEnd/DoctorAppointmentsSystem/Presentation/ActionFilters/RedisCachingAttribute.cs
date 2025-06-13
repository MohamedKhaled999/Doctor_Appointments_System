using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Services.Abstraction;
using System.Net;
using System.Text;

namespace Presentation.Caching
{
    public class RedisCachingAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var cachingService = context.HttpContext.RequestServices.GetRequiredService<IServiceManager>().CachingService;
            string cacheKey = GenerateCachedKey(context.HttpContext.Request);
            var result = cachingService.GetCachedValue(cacheKey);
            if (result != null)
            {
                context.Result = new ContentResult
                {
                    Content = result,
                    ContentType = "application/json",
                    StatusCode = (int)HttpStatusCode.OK
                };
                return;
            }
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var cachingService = context.HttpContext.RequestServices.GetRequiredService<IServiceManager>().CachingService;
            string cacheKey = GenerateCachedKey(context.HttpContext.Request);
            if (context.Result is OkObjectResult okObject)
            {
                cachingService.SetCachedValue(cacheKey, okObject.Value, TimeSpan.FromHours(1));
            }
        }

        private string GenerateCachedKey(HttpRequest request)
        {
            var KeyBuilder = new StringBuilder();
            KeyBuilder.Append(request.Path);
            if (request.Query.Any())
                KeyBuilder.Append('?');
            foreach (var item in request.Query.OrderBy(q => q.Key))
            {
                if (item.Key == request.Query.OrderBy(q => q.Key).Last().Key)
                    KeyBuilder.Append($"{item.Key}={item.Value}");
                else
                    KeyBuilder.Append($"{item.Key}={item.Value}&");
            }
            return KeyBuilder.ToString().ToLower();
        }
    }
}