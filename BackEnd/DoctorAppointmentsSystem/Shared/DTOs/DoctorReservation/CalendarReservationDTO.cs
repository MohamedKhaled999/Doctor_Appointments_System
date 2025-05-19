namespace Shared.DTOs.DoctorReservation
{
    public class CalendarReservationDTO
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Color { get; set; } = "#004085";
        public string ColorBorder { get; set; } = "#B3E5FC";
        public string Status { get; set; } = string.Empty;
        public int ResID { get; set; }
        public int MaxRes { get; set; } = 10;
        public bool IsAllDay { get; set; } = true;
    }
}
