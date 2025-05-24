using Shared.DTOs.Email;

namespace Services.Abstraction

{
    public interface IEmailService
    {
        public void SendEmail(EmailDTO email, string username);
        public void SendEmail(EmailDTO email, string username, string body);
    }
}
