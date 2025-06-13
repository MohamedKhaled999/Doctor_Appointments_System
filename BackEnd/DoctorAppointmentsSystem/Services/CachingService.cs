using System.Text.Json;
using Services.Abstraction;

namespace Services;

public class CachingService : ICachingService
{
    private IRedisRepo _redisRepo;

    public CachingService(IRedisRepo redisRepo)
        => _redisRepo = redisRepo;

    public string? GetCachedValue(string key)
        => _redisRepo.GetItem(key);

    public void SetCachedValue(string key, object value, TimeSpan expirationTime)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        string json = JsonSerializer.Serialize(value, options);
        _redisRepo.SetItem(key, json, expirationTime);
    }
}
