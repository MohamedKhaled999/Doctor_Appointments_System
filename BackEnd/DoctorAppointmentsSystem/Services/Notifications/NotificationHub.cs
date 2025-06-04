using Microsoft.AspNetCore.SignalR;

namespace Services.Notifications
{
    public class NotificationHub : Hub
    {
        //internal static ConcurrentDictionary<int, List<string>> OnlineUsers = [];

        //public override Task OnConnectedAsync()
        //{
        //    var user = Context.User;
        //    if (user?.Identity?.IsAuthenticated == true)
        //    {
        //        var appUserId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier).Value);
        //        if (OnlineUsers.ContainsKey(appUserId))
        //            OnlineUsers[appUserId].Add(Context.ConnectionId);
        //        else
        //            OnlineUsers[appUserId] = new List<string>() { Context.ConnectionId };
        //    }
        //    return base.OnConnectedAsync();
        //}

        //public override Task OnDisconnectedAsync(Exception? exception)
        //{
        //    var user = Context.User;
        //    if (user?.Identity?.IsAuthenticated == true)
        //    {
        //        var appUserId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier).Value);
        //        if (OnlineUsers[appUserId].Count > 1)
        //            OnlineUsers[appUserId].Remove(Context.ConnectionId);
        //        else
        //            OnlineUsers.Remove(appUserId, out _);
        //    }
        //    return base.OnDisconnectedAsync(exception);
        //}
    }
}
