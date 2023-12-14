namespace Year2023;

class Day06
{
    private readonly string[] Lines;

    private readonly List<Race> Races;

    private readonly Race RealRace;

    public Day06()
    {
        Lines = File.ReadAllLines("../../../Year2023/Day06/input.txt");
        var times = Lines[0]
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Skip(1)
            .Select(long.Parse)
            .ToList();
        var distances = Lines[1]
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Skip(1)
            .Select(long.Parse)
            .ToList();
        
        Races = new List<Race>();

        var realTime = "";
        var realDistance = "";

        for (var i = 0; i < times.Count; ++i)
        {
            Races.Add(new Race {
                Time = times[i],
                BestDistance = distances[i]
            });

            realTime += times[i];
            realDistance += distances[i];
        }

        RealRace = new Race {Time = long.Parse(realTime), BestDistance = long.Parse(realDistance)};
    }

    public async Task PartOneAsync()
    {
        long product = 1;

        foreach (var race in Races)
        {
            var firstWinningTime = FindWinningTime(race);

            var possibilities = race.Time - (2 * firstWinningTime) + 1;

            product *= possibilities;
        }

        Console.WriteLine($"Part 1: {product}");
    }

    public async Task PartTwoAsync()
    {
        var firstWinningTime = FindWinningTime(RealRace);

        var possibilities = RealRace.Time - (2 * firstWinningTime) + 1;

        Console.WriteLine($"Part 2: {possibilities}");
    }

    private long FindWinningTime(Race race)
    {
        long limit = race.Time / 2;

        for (long i = 0; i <= limit; ++i)
        {
            long distance = i * (race.Time - i);
            if (distance > race.BestDistance) return i;
        }

        return 0;
    }

    class Race
    {
        public long Time { get; set; }
        public long BestDistance { get; set; }
    }
}