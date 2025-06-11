namespace Services.Abstraction;

public interface ICachingService
{
    void SetCachedValue(string key, object value, TimeSpan expirationTime);
    string? GetCachedValue(string key);
}
