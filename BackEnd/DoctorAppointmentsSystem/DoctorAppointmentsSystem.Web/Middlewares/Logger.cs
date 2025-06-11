namespace DoctorAppointmentsSystem.Web.Middlewares
{
    public class Logger : ILogger
    {
        private readonly LogLevel _logLevel;
        private readonly string _logFilePath;

        public Logger(LogLevel logLevel, IWebHostEnvironment environment)
        {
            _logLevel = logLevel;
            _logFilePath = Path.Combine(environment.WebRootPath, "logs", "logs.txt");
        }

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull
            => default;

        public bool IsEnabled(LogLevel logLevel)
            => logLevel >= _logLevel;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            if (IsEnabled(logLevel))
                using (StreamWriter writer = File.AppendText(_logFilePath))
                {
                    writer.WriteLine("");
                    writer.WriteLine($"--------------------------------------- {DateTime.Now} ---------------------------------------");
                    writer.WriteLine($"Event ID: {eventId}");
                    writer.WriteLine($"State: {state}");
                    if (exception != null)
                        writer.WriteLine($"Exception: {exception}");
                    writer.WriteLine($"Message: {formatter(state, exception)}");
                    writer.WriteLine("");
                    Console.WriteLine("");
                    Console.WriteLine($"--------------------------------------- {DateTime.Now} ---------------------------------------");
                    Console.WriteLine($"Event ID: {eventId}");
                    Console.WriteLine($"State: {state}");
                    if (exception != null)
                        Console.WriteLine($"Exception: {exception}");
                    Console.WriteLine($"Message: {formatter(state, exception)}");
                    Console.WriteLine("");
                }
        }
    }
}
