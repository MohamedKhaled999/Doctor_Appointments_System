using Microsoft.AspNetCore.SignalR;
using Services.Abstraction.Notifications;

namespace Services.Notifications
{
    internal class NotificationSender : INotificationSender
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationSender(IHubContext<NotificationHub> hubContext) => _hubContext = hubContext;

        public async Task SendNotificationAsync(int appUserId, string message)
        {
            await _hubContext.Clients.User(appUserId.ToString()).SendAsync("newNotification", message);
        }
    }
}
