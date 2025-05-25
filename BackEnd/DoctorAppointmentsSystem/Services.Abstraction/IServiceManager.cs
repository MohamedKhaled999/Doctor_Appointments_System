using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Abstraction
{
    public interface IServiceManager
    {
        IPatientService PatientService { get; }
        IDoctorService DoctorService { get; }
        IAuthenticationService  AuthenticationService { get; }
        IEmailService EmailService { get; }
        //IAppointmentService AppointmentService { get; }
        //IFileService FileService { get; }
        //INotificationService NotificationService { get; }

    }
}
