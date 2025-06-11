using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Shared.ValidationAttributes
{
    public class MaxSizeAttribute : ValidationAttribute
    {
        private readonly int _maxSize;
        public MaxSizeAttribute(int maxSize)
        {
            _maxSize = maxSize;
        }
        public override bool IsValid(object? value)
        {
            var file = value as IFormFile;
            if (file == null)
                return true;
            return file.Length <= _maxSize * 1024 * 1024;
        }
    }
}
