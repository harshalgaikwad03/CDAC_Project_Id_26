using System;
using System.IO;

namespace Eduride_Log.Logger
{
    public class FileLogger
    {
        private static FileLogger _fileLogger = new FileLogger();
        private FileLogger() { }

        public static FileLogger CurrentLogger
        {
            get { return _fileLogger; }
        }

        public void Log(string message)
        {
            //Dynamic project-relative path
            string path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "Eduride_Log",
                "Eduride_Log",
                "log.txt"
            );

            //Ensure directory exists
            string directory = Path.GetDirectoryName(path);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            // Write to file safely
            using (FileStream stream = new FileStream(path, FileMode.Append, FileAccess.Write))
            using (StreamWriter writer = new StreamWriter(stream))
            {
                writer.WriteLine(
                    "Logged at " +
                    DateTime.Now.ToString() +
                    " - " +
                    message
                );
            }
        }
    }
}