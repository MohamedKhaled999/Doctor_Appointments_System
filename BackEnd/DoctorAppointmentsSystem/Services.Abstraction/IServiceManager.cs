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
        IOrderService OrderService { get; }
        ICancellationService CancellationService { get; }
        IPaymentService PaymentService { get; }
        IAuthenticationService AuthenticationService { get; }
        IEmailService EmailService { get; }
        IUploadService UploadService { get; }
    }
}
