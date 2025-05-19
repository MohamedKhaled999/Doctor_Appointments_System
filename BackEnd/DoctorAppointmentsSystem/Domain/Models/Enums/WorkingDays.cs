namespace Domain.Models.Enums
{
    [Flags]
    public enum WorkingDays
    {
        Saturday = 1,
        Sunday = 2,
        Monday = 4,
        Tuesday = 8,
        Wednesday = 16,
        Thursday = 32,
        Friday = 64
    }
}
