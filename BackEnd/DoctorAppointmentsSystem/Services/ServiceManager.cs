using AutoMapper;
using Domain.Contracts;
using Domain.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Services.Abstraction;
using Services.Abstraction.Notifications;
using Services.Abstraction.Orchestrators;
using Services.Notifications;
using Services.Orchestrators;
using Shared.Authentication;

namespace Services
{
    public class ServiceManager : IServiceManager
    {
        private readonly Lazy<IHomeService> _homeService;

        private readonly Lazy<IPatientService> _patientService;
        private readonly Lazy<IAppointmentService> _appointmentService;
        private readonly Lazy<IReviewService> _reviewService;

        private readonly Lazy<IDoctorService> _doctorService;
        private readonly Lazy<IDoctorReservationService> _doctorReservationService;
        private readonly Lazy<ISpecialtyService> _specialtyService;

        private readonly Lazy<IAppointmentOrchestrator> _appointmentOrchestrator;
        private readonly Lazy<IDoctorOrchestrator> _doctorOrchestrator;
        private readonly Lazy<ITransactionService> _transactionService;

        private readonly Lazy<IPaymentService> _paymentService;

        private readonly Lazy<IAuthenticationService> _authenticationService;
        private readonly Lazy<IEmailService> _emailService;

        private readonly Lazy<IUploadService> _uploadService;

        private readonly Lazy<IRedisRepo> _redisRepo;
        private readonly Lazy<INotificationService> _notificationService;

        private readonly Lazy<IAdminOrchestrator> _adminOrchestrator;

        private readonly IWebHostEnvironment _environment;

        public ServiceManager(IUnitOfWork unitOfWork,
                              UserManager<AppUser> userManager,
                              IMapper mapper,
                              IOptions<JWTOptions> options,
                              IConfiguration configuration,
                              IWebHostEnvironment environment,
                              IServiceProvider serviceProvider)

        {
            _homeService = new Lazy<IHomeService>(() => new HomeService(unitOfWork, mapper));

            _patientService = new Lazy<IPatientService>(() => new PatientService(unitOfWork, mapper));
            _appointmentService = new Lazy<IAppointmentService>(() => new AppointmentService(unitOfWork, mapper));
            _reviewService = new Lazy<IReviewService>(() => new ReviewService(unitOfWork, mapper));

            _doctorService = new Lazy<IDoctorService>(() => new DoctorService(unitOfWork, mapper));
            _doctorReservationService = new Lazy<IDoctorReservationService>(() => new DoctorReservationService(unitOfWork, mapper));
            _specialtyService = new Lazy<ISpecialtyService>(() => new SpecialtyService(unitOfWork, mapper));

            _appointmentOrchestrator = new Lazy<IAppointmentOrchestrator>(() => new AppointmentOrchestrator(this, configuration));
            _doctorOrchestrator = new Lazy<IDoctorOrchestrator>(() => new DoctorOrchestrator(this));
            _transactionService = new Lazy<ITransactionService>(() => new TransactionService(unitOfWork, mapper));

            _paymentService = new Lazy<IPaymentService>(() => new PaymentService(configuration, userManager, this));

            _emailService = new Lazy<IEmailService>(() => new EmailService(configuration));

            _environment = environment;
            _uploadService = new Lazy<IUploadService>(() => new UploadService(_environment));

            _redisRepo = new Lazy<IRedisRepo>(() => new RedisRepo(configuration));
            _notificationService = new Lazy<INotificationService>(() => new NotificationService(this, new NotificationSender(serviceProvider.GetRequiredService<IHubContext<NotificationHub>>())));

            _adminOrchestrator = new Lazy<IAdminOrchestrator>(() => new AdminOrchestrator(unitOfWork, this));

            _authenticationService = new Lazy<IAuthenticationService>(() =>
            new AuthenticationService(userManager,
                                      _patientService.Value,
                                      _doctorOrchestrator.Value,
                                        unitOfWork,
                                      options,
                                      configuration,
                                      mapper,
                                      _emailService.Value));

        }
        public IHomeService HomeService => _homeService.Value;

        public IPatientService PatientService => _patientService.Value;

        public IAppointmentService AppointmentService => _appointmentService.Value;

        public IReviewService ReviewService => _reviewService.Value;

        public IDoctorService DoctorService => _doctorService.Value;

        public IDoctorReservationService DoctorReservationService => _doctorReservationService.Value;

        public ISpecialtyService SpecialtyService => _specialtyService.Value;

        public ITransactionService TransactionService => _transactionService.Value;

        public IAppointmentOrchestrator AppointmentOrchestrator => _appointmentOrchestrator.Value;

        public IDoctorOrchestrator DoctorOrchestrator => _doctorOrchestrator.Value;

        public IPaymentService PaymentService => _paymentService.Value;

        public IAuthenticationService AuthenticationService => _authenticationService.Value;

        public IEmailService EmailService => _emailService.Value;

        public IUploadService UploadService => _uploadService.Value;

        public IRedisRepo RedisRepo => _redisRepo.Value;

        public INotificationService NotificationService => _notificationService.Value;

        public IAdminOrchestrator AdminOrchestrator => _adminOrchestrator.Value;
    }
}
