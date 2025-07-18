﻿namespace Services.Abstraction
{
    public interface IRedisRepo
    {

        void SetItem(string key, string value, TimeSpan expirationTime);
        string? GetItem(string key);
        List<string>? GetKeys(string prefix);
    }
}
