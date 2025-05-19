namespace Services.Abstraction
{
    public interface IOrderService
    {
        bool IsOrderPaid(int patientId, int doctorReservationId);
        void AddOrder(string id, int patientId, int doctorReservationId);
        void DeleteOrder(int patientId, int doctorReservationId);
        void MarkAsPaid(int patientId, int doctorReservationId);
        void SetOrderCaptureId(string orderId, string captureId);
        Order? GetOrder(int patientId, int doctorReservationId);
        Order? GetOrderById(string orderId);
    }
}
