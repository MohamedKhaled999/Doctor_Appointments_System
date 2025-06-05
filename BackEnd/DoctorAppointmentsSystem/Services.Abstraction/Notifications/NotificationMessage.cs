using Shared.Enums;

namespace Services.Abstraction.Notifications
{
    public class NotificationMessage
    {
        public long Id { get; set; }
        public string Message { get; set; }
        public NotificationEvents EventType { get; set; }
        public DateTime TimeStamp { get; set; } = DateTime.Now;
        public bool IsRead { get; set; }
    }
}
