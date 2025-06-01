using Shared.DTOs.Email;

namespace Services.Abstraction

{
    public interface IEmailService
    {
        public void SendEmail(EmailDTO email, string username, DateTime appointmentDate = new(), bool partialRefund = false);
    }
}
