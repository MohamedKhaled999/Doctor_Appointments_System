using Microsoft.AspNetCore.Http;
using Shared.Authentication;

namespace Services.Abstraction.Orchestrators
{
    public interface IDoctorOrchestrator
    {
        public Task RegisterDoctor(DoctorRegisterDto dto);
    }
}
