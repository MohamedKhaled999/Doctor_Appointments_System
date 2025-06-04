using Microsoft.Extensions.Configuration;
using Services.Abstraction;
using StackExchange.Redis;

namespace Services
{
    internal class RedisRepo : IRedisRepo
    {
        private readonly IDatabase _database;
        public RedisRepo(IConfiguration configuration)
        {
            var muxer = ConnectionMultiplexer.Connect(
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
                    Password = configuration["NotificationSettings:Password"]
                }
            );
            _database = muxer.GetDatabase();
        }

        public void SetItem(string key, string value)
            => _database.StringSet(key, value, TimeSpan.FromDays(7));

        public string? GetItem(string key)
            => _database.StringGet(key);
    }
}
