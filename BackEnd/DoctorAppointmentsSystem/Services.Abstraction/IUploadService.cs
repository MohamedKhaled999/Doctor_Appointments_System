using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Abstraction
{
    public interface IUploadService
    {
        Task<string> UploadFile(IFormFile file, string folderName = "images", string oldFilename = null);
        bool Delete(string filePath);
    }


}
