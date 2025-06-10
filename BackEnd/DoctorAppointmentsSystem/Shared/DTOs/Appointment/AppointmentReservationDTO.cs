namespace Shared.DTOs.Appointment;

public class AppointmentReservationDTO
{
    public int Id { get; set; }
    public string Patient { get; set; }
    public string? DocumentUrls { get; set; }
    public string? PrescriptionUrl { get; set; }
}
