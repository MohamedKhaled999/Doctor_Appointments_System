using AutoMapper;
using Domain.Contracts;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Services.Abstraction;
using Shared.Authentication;

namespace Services
{
    public class ServiceManager : IServiceManager
    {
        
        private readonly Lazy<IPatientService> _patientService;

        private readonly Lazy<IAuthenticationService> _authenticationService;
        private readonly Lazy<IEmailService>  _emailService;



        public ServiceManager(IUnitOfWork unitOfWork, UserManager<AppUser> userManager, IMapper mapper,
            IOptions<JWTOptions> options, IConfiguration configuration)
        {
            _patientService = new Lazy<IPatientService>(() => new PatientService(unitOfWork,mapper));
            _emailService = new Lazy<IEmailService>(() => new EmailService(configuration));
            _authenticationService = new Lazy<IAuthenticationService>(() => new AuthenticationService(userManager,unitOfWork, options,configuration ,_emailService.Value));

        }
        public IPatientService PatientService => _patientService.Value;

        public IAuthenticationService AuthenticationService => _authenticationService.Value;

        public IEmailService EmailService => _emailService.Value;
    }
}
