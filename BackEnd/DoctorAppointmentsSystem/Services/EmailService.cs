using Microsoft.Extensions.Configuration;
using Services.Abstraction;
using Shared.DTOs.Email;
using System.Net;
using System.Net.Mail;

namespace Services
{
    internal class EmailService : IEmailService
    {
        private readonly string emailAddress;
        private readonly string password;

        public EmailService(IConfiguration configuration)
        {
            emailAddress = configuration["EmailSettings:EmailAddress"];
            password = configuration["EmailSettings:Password"];
        }

        public void SendEmail(EmailDTO email, string username, DateTime appointmentDate = new(), bool partialRefund = false)
        {
            MailMessage message = new MailMessage();
            message.From = new MailAddress(emailAddress, "DocNet");
            message.To.Add(email.To);
            message.IsBodyHtml = true;
            message.Subject = email.Subject;
            if (email.Template == MailTemplates.ConfirmEmailTemplate)
                message.Body = $"<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Email Confirmation</title><style>body{{font-family:Arial,sans-serif;background-color:#f4f4f7;margin:0;padding:0}}.container{{max-width:600px;margin:auto;background:#ffffff;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}}.header{{padding-bottom:20px}}.header img{{width:150px}}.button{{background-color:#007BFF;color:white !important;padding:12px 20px;text-decoration:none;border-radius:5px;display:inline-block;margin-top:20px}}.footer{{text-align:center;font-size:12px;color:#888;margin-top:20px}}</style></head><body><div class=\"container\"><div class=\"header\"><img src=\"https://doc-net2.runasp.net/uploads/images/DocNetLogo.png\" alt=\"DocNet Logo\"></div><h2>Email Confirmation</h2><p>Hello {username},</p><p>Thank you for signing up with <strong>DocNet</strong>. To complete your registration and start using our services, please verify your email address by clicking the confirmation button below. This helps us ensure the security of your account and enables you to access all features without any interruptions. The process is quick and only takes a moment.</p><a href=\"{email.Link}\" class=\"button\">Confirm Email</a><p>If you did not create this account or believe this message was sent to you by mistake, please disregard this email. No further action will be taken without your confirmation.</p><div class=\"footer\">&copy; 2025 ITI Student Team. All rights reserved.</div></div></body></html>\r\n";
            else if (email.Template == MailTemplates.CancelAppointmentTemplate)
                message.Body = $"<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Appointment Cancellation</title><style>body{{font-family:Arial,sans-serif;background-color:#f4f4f7;margin:0;padding:0}}.container{{max-width:600px;margin:auto;background:#ffffff;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}}.header{{padding-bottom:20px}}.header img{{width:150px}}.button{{background-color:#FF4C4C;color:white !important;padding:12px 20px;text-decoration:none;border-radius:5px;display:inline-block;margin-top:20px}}.footer{{text-align:center;font-size:12px;color:#888;margin-top:20px}}</style></head><body><div class=\"container\"><div class=\"header\"><img src=\"https://doc-net2.runasp.net/uploads/images/DocNetLogo.png\" alt=\"DocNet Logo\"></div><h2>Appointment Cancellation</h2><p>Hello {username},</p><p>We regret to inform you that your scheduled appointment on <strong>{appointmentDate}</strong> has been canceled and your payment has been {(partialRefund ? "partially refunded" : "refunded")}. We apologize for any inconvenience this may cause.</p><p>If you'd like to reschedule, please visit our website or contact our support team for assistance.</p><a href=\"https://doc-net.runasp.net/\" class=\"button\">visit the website</a><p>Thank you for your understanding, and we apologize for any disruption this may cause.</p><div class=\"footer\">&copy; 2025 ITI Student Team. All rights reserved.</div></div></body></html>";
            else if (email.Template == MailTemplates.RescheduleAppointmentTemplate)
                message.Body = $"<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Appointment Rescheduled</title><style>body{{font-family:Arial,sans-serif;background-color:#f4f4f7;margin:0;padding:0}}.container{{max-width:600px;margin:auto;background:#ffffff;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}}.header{{padding-bottom:20px}}.header img{{width:150px}}.button{{background-color:#FF4C4C;color:white !important;padding:12px 20px;text-decoration:none;border-radius:5px;display:inline-block;margin-top:20px}}.footer{{text-align:center;font-size:12px;color:#888;margin-top:20px}}</style></head><body><div class=\"container\"><div class=\"header\"><img src=\"https://doc-net2.runasp.net/uploads/images/DocNetLogo.png\" alt=\"DocNet Logo\"></div><h2>Appointment Cancellation</h2><p>Hello {username},</p><p>We regret to inform you that your scheduled appointment on <strong>{appointmentDate}</strong> has been rescheduled. We apologize for any inconvenience this may cause.</p><p>If you'd like to reschedule, please visit our website or contact our support team for assistance.</p><a href=\"https://doc-net.runasp.net/\" class=\"button\">visit the website</a><p>Thank you for your understanding, and we apologize for any disruption this may cause.</p><div class=\"footer\">&copy; 2025 ITI Student Team. All rights reserved.</div></div></body></html>";
            else
                message.Body = $"<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Reset Password</title><style>body{{font-family:Arial,sans-serif;background-color:#f4f4f7;margin:0;padding:0}}.container{{max-width:600px;margin:auto;background:#ffffff;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}}.header{{padding-bottom:20px}}.header img{{width:150px}}.button{{background-color:#007BFF;color:white !important;padding:12px 20px;text-decoration:none;border-radius:5px;display:inline-block;margin-top:20px}}.footer{{text-align:center;font-size:12px;color:#888;margin-top:20px}}</style></head><body><div class=\"container\"><div class=\"header\"><img src=\"https://doc-net2.runasp.net/uploads/images/DocNetLogo.png\" alt=\"DocNet Logo\"></div><h2>Reset Password</h2><p>Hello {username},</p><p>We received a request to reset the password associated with your account at <strong>DocNet</strong>. If you made this request, please click the button below to choose a new password and regain access to your account. This link will expire after a limited time for your security.</p><a href=\"{email.Link}\" class=\"button\">Reset Password</a><p>If you did not make this request or believe this message was sent to you by mistake, please disregard this email. No further action will be taken without your confirmation.</p><div class=\"footer\">&copy; 2025 ITI Student Team. All rights reserved.</div></div></body></html>\r\n";

            using SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
            smtpClient.EnableSsl = true;
            smtpClient.Credentials = new NetworkCredential(emailAddress, password);
            smtpClient.Send(message);
        }
    }
}

