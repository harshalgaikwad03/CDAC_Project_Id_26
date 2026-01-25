namespace Eduride_Log.Models
{
    public class LogRequest
    {
        public string Level { get; set; }
        public string Message { get; set; }
        public string Source { get; set; }
        public string Data { get; set; }
    }
}
