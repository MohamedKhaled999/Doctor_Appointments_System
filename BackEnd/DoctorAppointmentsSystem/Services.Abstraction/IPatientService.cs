using System.Linq.Expressions;

namespace Services.Abstraction
{
    public interface IPatientService
    {
        Task AddPatient(Patient patientVM);
        Task UpdatePatient(Patient patientVM);
        Task<Patient> GetPatientInfo(int patientID);
        Task<List<Patient>> GetAllPatients();
        Task<List<Patient>?> GetPatientCondition(Expression<Func<Patient, bool>> condition);
    }
}
