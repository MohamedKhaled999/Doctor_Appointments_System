using Microsoft.AspNetCore.Http;

namespace Services.Abstraction
{
    public interface IUploadService
    {
        Task<string> UploadFile(IFormFile file, string oldFilename = null);
        bool Delete(string fileName);
    }
}
