using Services.Abstraction;
using Services.Abstraction.Orchestrators;
using Shared.Authentication;

namespace Services.Orchestrators
{
    internal class DoctorOrchestrator : IDoctorOrchestrator
    {
        private readonly IDoctorService doctorService;
        private readonly IUploadService uploadService;
        public DoctorOrchestrator(IServiceManager serviceManager)
        {
            doctorService = serviceManager.DoctorService;
            uploadService = serviceManager.UploadService;
        }
        async Task IDoctorOrchestrator.RegisterDoctor(DoctorRegisterDto dto)
        {
            var ImgUrl = await uploadService.UploadFile(dto.Image);
            dto.ImageURL = ImgUrl;
            await doctorService.AddAsync(dto);
        }
    }
}
