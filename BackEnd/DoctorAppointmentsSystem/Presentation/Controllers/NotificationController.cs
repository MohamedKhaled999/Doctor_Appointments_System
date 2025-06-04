using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Abstraction;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize]
    [Route("/api/notifications")]
    public class NotificationController : ApiController
    {
        private readonly IServiceManager _serviceManager;

        public NotificationController(IServiceManager serviceManager) => _serviceManager = serviceManager;

        [HttpGet]
        public IActionResult GetNotifications()
        {
            var notification = _serviceManager.NotificationService.GetNotifications(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Ok(notification);
        }

        // For Testing Only
        //[HttpPost]
        //public IActionResult SendNotification()
        //{
        //    var notification = _serviceManager.NotificationService.SendNotification(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value), new Services.Abstraction.Notifications.NotificationMessage());
        //    return Ok(notification);
        //}

        [HttpPost("mark-as-read")]
        public IActionResult MarkAsRead(int notificationId)
        {
            _serviceManager.NotificationService.MarkAsRead(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value), notificationId);
            return Ok();
        }
    }
}
