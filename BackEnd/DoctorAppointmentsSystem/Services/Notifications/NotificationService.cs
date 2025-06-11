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
            var userKeys = _redisRepo.GetKeys($"{appUserId}|");
            if (userKeys == null)
                return null;
            var notifications = new List<NotificationMessage>();
            foreach (var key in userKeys)
            {
                var notification = _redisRepo.GetItem(key);
                notifications.Add(JsonSerializer.Deserialize<NotificationMessage>(notification));
            }
            return notifications.OrderBy(n => n.Id).ToList();
        }

        public async Task SendNotification(int appUserId, NotificationMessage message)
        {
            var userKeys = _redisRepo.GetKeys($"{appUserId}|");
            if (userKeys.Count == 0)
                message.Id = 1;
            else
                message.Id = int.Parse(userKeys.OrderBy(k => k).Last().Split("|")[1]) + 1;
            await _notificationSender.SendNotificationAsync(appUserId, JsonSerializer.Serialize(message));
            _redisRepo.SetItem($"{appUserId}|{message.Id}", JsonSerializer.Serialize(message));
        }

        public void MarkAsRead(int appUserId, long notificationId)
        {
            var message = _redisRepo.GetItem($"{appUserId}|{notificationId}");
            if (message == null)
                throw new ValidationException(["Message Unavailable"]);

            var deserializedMessage = JsonSerializer.Deserialize<NotificationMessage>(message);
            deserializedMessage.IsRead = true;
            _redisRepo.SetItem($"{appUserId}|{notificationId}", JsonSerializer.Serialize(deserializedMessage));
        }
    }
}
