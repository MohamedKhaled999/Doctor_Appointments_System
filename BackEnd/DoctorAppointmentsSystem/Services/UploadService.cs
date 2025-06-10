using Domain.Exceptions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Services.Abstraction;
using System.Text.RegularExpressions;

namespace Services
{
    public class UploadService : IUploadService
    {
        private const int ImageMaxSize = 2_097_152; // 2 MBs;
        private const int DocumentMaxSize = 10_485_760; // 10 MBs;
        private readonly Regex ImageRegex = new Regex(@"^.*\.(jpg|jpeg|png|gif|bmp|webp|svg)$", RegexOptions.IgnoreCase);
        private readonly Regex DocumentRegex = new Regex(@"^.*\.(pdf)$", RegexOptions.IgnoreCase);
        private readonly string rootFolderPath;

        public UploadService(IWebHostEnvironment environment)
        {
            rootFolderPath = $@"{environment.WebRootPath}\uploads";
        }

        public async Task<string> UploadFile(IFormFile file, string? oldFilename = null)
        {
            if (file == null)
                throw new ArgumentNullException("File is Null");

            if (!ImageRegex.IsMatch(file.FileName) && !DocumentRegex.IsMatch(file.FileName))
                throw new ValidationException(["Only Images and Documents are allowed"]);

            if (ImageRegex.IsMatch(file.FileName) && file.Length > ImageMaxSize)
                throw new ValidationException(["Image Exceeds Max Size (2 MBs)"]);

            if (DocumentRegex.IsMatch(file.FileName) && file.Length > DocumentMaxSize)
                throw new ValidationException(["Document Exceeds Max Size (10 MBs)"]);

            string folderName = string.Empty;
            if (IsImage(file.FileName))
                folderName = "images";
            else
                folderName = "documents";
            string folderPath = Path.Combine(rootFolderPath, folderName);
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            if (oldFilename != null)
            {
                File.Delete(Path.Combine(folderPath, oldFilename));
            }

            string fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            string filePath = Path.Combine(folderPath, fileName);

            using FileStream fileStream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(fileStream);

            return fileName;
        }

        public bool Delete(string fileName)
        {
            string folderName = string.Empty;
            if (IsImage(fileName))
                folderName = "images";
            else
                folderName = "documents";

            if (File.Exists(Path.Combine(rootFolderPath, folderName, fileName)))
            {
                File.Delete(Path.Combine(rootFolderPath, folderName, fileName));
                return true;
            }
            return false;
        }

        private bool IsImage(string fileName)
            => ImageRegex.IsMatch(fileName);
    }
}
