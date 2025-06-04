namespace Services.Abstraction.Notifications
{
    public interface INotificationService
    {
        public List<NotificationMessage>? GetNotifications(int appUserId);
        Task SendNotification(int appUserId, NotificationMessage message);
        void MarkAsRead(int appUserId, int notificationId);
    }
}
