namespace Shared.DTOs.Email
{
    public class EmailDTO
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Link { get; set; }
        public MailTemplates Template { get; set; }
    }
}
