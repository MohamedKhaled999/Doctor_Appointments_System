namespace Services.Abstraction
{
    public interface IRedisRepo
    {
        void SetItem(string key, string value);
        string? GetItem(string key);
        List<string>? GetKeys(string prefix);
    }
}
