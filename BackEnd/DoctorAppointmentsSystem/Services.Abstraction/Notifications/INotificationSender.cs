namespace Services.Abstraction.Notifications
{
    public interface INotificationSender
    {
        Task SendNotificationAsync(int appUserId, string message);
    }
}
