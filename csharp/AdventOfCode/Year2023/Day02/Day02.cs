namespace Year2023;

class Day02 {

    private readonly List<Game> Games;

    public Day02()
    {
        Games = File
            .ReadAllLines("../../../Year2023/Day02/input.txt")
            .Select(l => new Game(l))
            .ToList();
    }

    public async Task PartOneAsync()
    {
        var sum = 0;

        foreach (var game in Games)
        {
            if (game.Rolls.All(r => 
                r.BlueCubes <= 14 &&
                r.GreenCubes <= 13 &&
                r.RedCubes <= 12))
            {
                sum += game.Id;
            }
        }

        Console.WriteLine($"Part 1: {sum}");
    }

    public async Task PartTwoAsync()
    {
        var sum = 0;

        foreach (var game in Games)
        {
            var minBlue = 0;
            var minGreen = 0;
            var minRed = 0;

            foreach (var roll in game.Rolls)
            {
                minBlue = Math.Max(minBlue, roll.BlueCubes);
                minGreen = Math.Max(minGreen, roll.GreenCubes);
                minRed = Math.Max(minRed, roll.RedCubes);
            }

            sum += minBlue * minGreen * minRed;
        }

        Console.WriteLine($"Part 2: {sum}");
    }

    class Game
    {
        public readonly int Id;
        public readonly List<Roll> Rolls;

        public Game(string gameString)
        {
            var parts = gameString.Split(":");
            
            Id = int.Parse(parts[0].Substring(5));
            Rolls = parts[1]
                .Split(";")
                .Select(rs => new Roll(rs))
                .ToList();
        }
    }

    class Roll
    {
        public int BlueCubes { get; set; }
        public int GreenCubes { get; set; }
        public int RedCubes { get; set; }

        public Roll(int blueCubes, int greenCubes,int redCubes)
        {
            BlueCubes = blueCubes;
            GreenCubes = greenCubes;
            RedCubes = redCubes;
        }

        public Roll(string rollString)
        {
            var cubeGroups = rollString.Split(",");
            foreach(var g in cubeGroups)
            {
                var parts = g.Split(" ", StringSplitOptions.RemoveEmptyEntries);
                
                var cubes = int.Parse(parts[0]);
                var color = parts[1].ToLower();

                switch (color)
                {
                    case "blue":
                        BlueCubes += cubes;
                        break;
                    case "green":
                        GreenCubes += cubes;
                        break;
                    case "red":
                        RedCubes += cubes;
                        break;
                    default:
                        throw new ArgumentException($"Unhandled cube color: {color}");
                }
            }

        }
    }
}