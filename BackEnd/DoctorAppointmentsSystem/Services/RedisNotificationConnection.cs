using Services.Abstraction;
using Shared.Caching;

namespace Services
{
    public class RedisNotificationConnection(RedisOptions redisOptions) : RedisRepo(redisOptions), IRedisNotificationConnection
    {
    }
}
