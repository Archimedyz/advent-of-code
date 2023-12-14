using System.Diagnostics;

public class Utils
{
    public static async Task TimeAndRunAsync(Func<Task> function)
    {
        Console.WriteLine("Starting...");
        Console.WriteLine("\tRunning in directory: " + Directory.GetCurrentDirectory() + Environment.NewLine);

        var sw = new Stopwatch();
        sw.Start();

        await function.Invoke();

        sw.Stop();
        Console.WriteLine($"\nTotal runtime: {MillisecondsToString(sw.ElapsedMilliseconds)}");
                
        Console.WriteLine("Finished!");
    }

    private static string MillisecondsToString(long value)
    {
        var msPart = value % 1000;
        value /= 1000;
        var sPart = value % 60;
        value /= 1000;
        var minPart = value % 60;
        value /= 60;
        var hrPart = value % 60;

        return $"{hrPart:D2}:{minPart:D2}:{sPart:D2}.{msPart:D3}";
    }
}