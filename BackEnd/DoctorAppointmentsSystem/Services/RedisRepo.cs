using Microsoft.Extensions.Configuration;
using Services.Abstraction;
using StackExchange.Redis;

namespace Services
{
    internal class RedisRepo : IRedisRepo
    {
        private readonly IDatabase _database;
        private readonly IServer _server;
        public RedisRepo(IConfiguration configuration)
        {
            var mux = ConnectionMultiplexer.Connect(
                new ConfigurationOptions
                {
                    EndPoints =
                    {
                        {
                            configuration["NotificationSettings:Host"],
                            int.Parse(configuration["NotificationSettings:Port"])
                        }
                    },
                    User = configuration["NotificationSettings:User"],
                    Password = configuration["NotificationSettings:Password"],
                    AbortOnConnectFail = false
                }
            );
            _server = mux.GetServer(mux.GetEndPoints()[0]);
            _database = mux.GetDatabase();
        }

        public void SetItem(string key, string value)
            => _database.StringSet(key, value, TimeSpan.FromHours(3));

        public string? GetItem(string key)
            => _database.StringGet(key);

        public List<string>? GetKeys(string prefix)
            => _server.Keys(pattern: $"{prefix}*").Select(k => (string)k).ToList();
    }
}
