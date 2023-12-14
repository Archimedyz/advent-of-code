namespace Year2023;

class Day01 {

    private string[] inputLines;

    public Day01()
    {
        inputLines = File.ReadAllLines("../../../Year2023/Day01/input.txt");
    }

    public async Task PartOneAsync()
    {
        var sum = 0;

        foreach (var line in inputLines)
        {
            var firstDigit = line.ToCharArray().First(char.IsDigit);
            var lastDigit = line.ToCharArray().Last(char.IsDigit);

            var num = int.Parse($"{firstDigit}{lastDigit}");
            sum += num;
        }

        Console.WriteLine($"Part 1: {sum}");
    }

    public async Task PartTwoAsync()
    {
        var sum = 0;
        
        foreach (var line in inputLines)
        {
            string firstDigit = null;
            string lastDigit = null;

            for (var i = 0; i < line.Length; ++i)
            {
                if (char.IsDigit(line[i]))
                {
                    lastDigit = $"{line[i]}";
                }
                else if (TryParseDigit(line, i, out var d, out var skip))
                {
                    lastDigit = d;
                }
                else
                {
                    continue;
                }

                if (firstDigit == null)
                {
                    firstDigit = lastDigit;
                }
            }

            var num = int.Parse($"{firstDigit}{lastDigit}");

            sum += num;
        }

        Console.WriteLine($"Part 2: {sum}");
    }

    private bool TryParseDigit(string input, int index, out string? digitString, out int skip)
    {
        var str = input.Substring(index);
        var wordDigits = new Dictionary<string, string>
        {
            //{"zero", "0"},
            {"one", "1"},
            {"two", "2"},
            {"three", "3"},
            {"four", "4"},
            {"five", "5"},
            {"six", "6"},
            {"seven", "7"},
            {"eight", "8"},
            {"nine", "9"}
        };

        foreach (var kv in wordDigits)
        {
            if (!str.StartsWith(kv.Key)) continue;
            
            digitString = kv.Value;
            skip = kv.Key.Length - 1;
            return true;
        }

        digitString = null;
        skip = 0;
        return false;
    }
}
