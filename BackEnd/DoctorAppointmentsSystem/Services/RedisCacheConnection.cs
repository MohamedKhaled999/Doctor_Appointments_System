using Services.Abstraction;
using Shared.Caching;

namespace Services
{
    public class RedisCacheConnection(RedisOptions redisOptions) : RedisRepo(redisOptions), IRedisCacheConnection
    {
    }
}
