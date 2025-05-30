using System.ComponentModel.DataAnnotations;

namespace Shared.Payment
{
    public class PaymentDto
    {
        public int PatientId { get; set; }
        public int DoctorReservationId { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
        public double AmountOfMoney { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; } = "Appointment Payment";               // Default name, can be changed as needed

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; } = "Payment for appointment";    // Default description, can be changed as needed


    }
}
