namespace Services.Abstraction
{
    public interface ICancellationService
    {
        public Task CancelDoctorReservation(int resId);
    }
}
