using Domain.Exceptions;
using Services.Abstraction;
using Services.Abstraction.Notifications;
using System.Text.Json;

namespace Services.Notifications
{
    internal class NotificationService : INotificationService
    {
        private readonly IRedisRepo _redisRepo;
        private readonly INotificationSender _notificationSender;

        public NotificationService(IServiceManager serviceManager, INotificationSender notificationSender)
        {
            _redisRepo = serviceManager.RedisRepo;
            _notificationSender = notificationSender;
        }

        public List<NotificationMessage>? GetNotifications(int appUserId)
        {
            var notifications = _redisRepo.GetItem(appUserId.ToString());
            if (notifications == null)
                return null;
            return JsonSerializer.Deserialize<List<NotificationMessage>>(notifications);
        }

        public async Task SendNotification(int appUserId, NotificationMessage message)
        {
            string serializedMessages = string.Empty;
            var existingMessages = _redisRepo.GetItem(appUserId.ToString());
            if (existingMessages != null)
            {
                var messages = JsonSerializer.Deserialize<List<NotificationMessage>>(existingMessages);
                message.Id = messages.Last().Id + 1;
                messages.Add(message);
                serializedMessages = JsonSerializer.Serialize(messages);
            }
            else
            {
                message.Id = 1;
                serializedMessages = JsonSerializer.Serialize(new List<NotificationMessage>() { message });
            }

            await _notificationSender.SendNotificationAsync(appUserId, JsonSerializer.Serialize(message));
            _redisRepo.SetItem(appUserId.ToString(), serializedMessages);
        }

        public void MarkAsRead(int appUserId, int notificationId)
        {
            var existingMessages = _redisRepo.GetItem(appUserId.ToString());
            if (existingMessages == null)
                throw new ValidationException(["Message Unavailable"]);

            var messages = JsonSerializer.Deserialize<List<NotificationMessage>>(existingMessages);
            if (!messages.Where(m => m.Id == notificationId).Any())
                throw new ValidationException(["Message Unavailable"]);

            messages.Where(m => m.Id == notificationId).First().IsRead = true;
            _redisRepo.SetItem(appUserId.ToString(), JsonSerializer.Serialize(messages));
        }
    }
}
