namespace Infrastructure.Services.CancellationService
{
    public interface IOrderCancellationService
    {
        public Task CancelDoctorReservation(int resId);
    }
}
