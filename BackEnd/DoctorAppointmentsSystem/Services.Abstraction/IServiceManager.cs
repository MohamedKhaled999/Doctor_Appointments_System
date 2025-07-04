using Services.Abstraction.Notifications;
using Services.Abstraction.Orchestrators;

namespace Services.Abstraction
{
    public interface IServiceManager
    {
        IHomeService HomeService { get; }
        IPatientService PatientService { get; }
        IAppointmentService AppointmentService { get; }
        IReviewService ReviewService { get; }
        IDoctorService DoctorService { get; }
        IDoctorReservationService DoctorReservationService { get; }
        ISpecialtyService SpecialtyService { get; }
        ITransactionService TransactionService { get; }
        IAppointmentOrchestrator AppointmentOrchestrator { get; }
        IDoctorOrchestrator DoctorOrchestrator { get; }
        IPaymentService PaymentService { get; }
        IAuthenticationService AuthenticationService { get; }
        IEmailService EmailService { get; }
        IUploadService UploadService { get; }
        INotificationService NotificationService { get; }
        IAdminOrchestrator AdminOrchestrator { get; }
        ICachingService CachingService { get; }
    }
}
