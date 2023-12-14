public class Day20
{
    private static int input = 36000000;

    public static async Task RunAsync1()
    {
        var houseToPresents = new Dictionary<int, long>();
        var upperLimit = input / 10;

        for (var elf = 1; elf <= upperLimit; ++elf)
        {
            for (var house = elf; house <= upperLimit; house += elf)
            {
                if (!houseToPresents.ContainsKey(house))
                {
                    houseToPresents.Add(house, elf * 10);
                    continue;
                }

                houseToPresents[house] += elf * 10;
            }
        }
        
        var res = houseToPresents.OrderBy(kv => kv.Key).FirstOrDefault(kv => kv.Value >= input);

        //Print(houseToPresents);

        Console.WriteLine($"Part One: {res}");
    }
    public static async Task RunAsync2()
    {
        var houseToPresents = new Dictionary<int, long>();
        var upperLimit = input / 11;

        for (var elf = 1; elf <= upperLimit; ++elf)
        {
            for (int house = elf, i = 0; house <= upperLimit && i < 50; house += elf, i++)
            {
                if (!houseToPresents.ContainsKey(house))
                {
                    houseToPresents.Add(house, elf * 11);
                    continue;
                }

                houseToPresents[house] += elf * 11;
            }
        }
        
        var res = houseToPresents.OrderBy(kv => kv.Key).FirstOrDefault(kv => kv.Value >= input);

        //Print(houseToPresents);

        Console.WriteLine($"Part Two: {res}");
    }

    private static void Print(Dictionary<int, long> d)
    {
        foreach(var kv in d.OrderBy(e => e.Key))
        {
            Console.WriteLine($"\t{kv.Key:D10} - {kv.Value}");
        }
    }
}