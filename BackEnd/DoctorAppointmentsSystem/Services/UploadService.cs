using Microsoft.AspNetCore.Http;
using Services.Abstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Services
{
    public class UploadService : IUploadService
    {
        private const int FileMaxSize = 2_097_152;//2Mbs;
        private readonly Regex ImageRegex = new Regex(@"^.*\.(jpg|jpeg|png|gif|bmp|webp|svg)$", RegexOptions.IgnoreCase);

       private  string rootFolderPath;
        public UploadService(string rootPath)
        {
            rootFolderPath = $@"{rootPath}\uploads";
        }

        public async Task<string> UploadFile(IFormFile file ,string folderName = "images",string oldFilename= null)
        {

            if (
                  file == null 
                ||!ImageRegex.IsMatch(file.FileName)
                ||file.Length>FileMaxSize
                )
            {
                throw new Exception("The File Is Not  Image , File Size Exceeded 2MBs OR File Is Null ");
            }

            //get the current path (in bin folder )
            string folderPath = Path.Combine(rootFolderPath, folderName);//wwwroot/uploads/folderName
            if (!Directory.Exists(folderPath)) 
            { 
                Directory.CreateDirectory(folderPath);
            }

            string fileName = string.Empty;
            if (oldFilename != null) 
            {
               
                File.Delete(Path.Combine(folderPath, oldFilename));
            }
           
             fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            
            string filePath = Path.Combine(folderPath ,fileName);

           using FileStream fileStream = new FileStream(filePath,FileMode.Create);
           await file.CopyToAsync(fileStream);

            return fileName;
           
        }
        
        public bool Delete(string fileName)
        {
            if (File.Exists(Path.Combine(rootFolderPath,"images", fileName)))

            {
                File.Delete(Path.Combine(rootFolderPath, "images", fileName));
                return true;
            }

            return false;
        }
    }
}
