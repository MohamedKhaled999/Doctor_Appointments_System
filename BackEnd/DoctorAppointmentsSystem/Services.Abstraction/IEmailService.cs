using Shared.DTOs.Email;

namespace Infrastructure.Services.EmailService
{
    public interface IEmailService
    {
        public void SendEmail(EmailDTO email, string username);
        public void SendEmail(EmailDTO email, string username, string body);
    }
}
