namespace Shared.DTOs.Doctor
{
    public class ReviewDTO
    {
        public int ID { get; set; }
        public string PatientName { get; set; }
        public string Review { get; set; }
        public float Rate { get; set; }
        public string Date { get; set; }
        public int DocID { get; set; }
    }
}
