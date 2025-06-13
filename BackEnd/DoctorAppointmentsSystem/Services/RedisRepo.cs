using Services.Abstraction;
using Shared.Caching;
using StackExchange.Redis;

namespace Services
{
    public class RedisRepo : IRedisRepo
    {
        private readonly IDatabase _database;
        private readonly IServer _server;
        public RedisRepo(RedisOptions options)
        {
            var mux = ConnectionMultiplexer.Connect(
                new ConfigurationOptions
                {
                    EndPoints =
                    {
                        {
                            options.Host,
                            int.Parse(options.Port)
                        }
                    },
                    User = options.User,
                    Password = options.Password,
                    AbortOnConnectFail = false
                }
            );
            _server = mux.GetServer(mux.GetEndPoints()[0]);
            _database = mux.GetDatabase();
        }

        public void SetItem(string key, string value, TimeSpan expirationTime)
            => _database.StringSet(key, value, expirationTime);

        public string? GetItem(string key)
            => _database.StringGet(key);

        public List<string>? GetKeys(string prefix)
            => _server.Keys(pattern: $"{prefix}*").Select(k => (string)k).ToList();
    }
}
