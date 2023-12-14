using System.Data;

namespace Year2023;

class Day05
{
    private readonly string[] Lines;

    private readonly List<long> Seeds;
    private readonly Map SeedToSoilMap;
    private readonly Map SoilToFertilizerMap;
    private readonly Map FertilizerToWaterMap;
    private readonly Map WaterToLightMap;
    private readonly Map LightToTemperatureMap;
    private readonly Map TemperatureToHumidtiyMap;
    private readonly Map HumidityToLocationMap;

    public Day05()
    {
        Lines = File.ReadAllLines("../../../Year2023/Day05/input.txt");

        Seeds = Lines[0]
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Skip(1)
            .Select(long.Parse)
            .ToList();
        SeedToSoilMap = CreateMap(Lines, 3, 20);
        SoilToFertilizerMap = CreateMap(Lines, 23, 30);
        FertilizerToWaterMap = CreateMap(Lines, 33, 67);
        WaterToLightMap = CreateMap(Lines, 70, 114);
        LightToTemperatureMap = CreateMap(Lines, 117, 130);
        TemperatureToHumidtiyMap = CreateMap(Lines, 133, 160);
        HumidityToLocationMap = CreateMap(Lines, 163, 173);
        
        // Lines = File.ReadAllLines("../../../Year2023/Day05/example.txt");

        // Seeds = Lines[0]
        //     .Split(' ', StringSplitOptions.RemoveEmptyEntries)
        //     .Skip(1)
        //     .Select(long.Parse)
        //     .ToList();
        // SeedToSoilMap = CreateMap(Lines, 3, 4);
        // SoilToFertilizerMap = CreateMap(Lines, 7, 9);
        // FertilizerToWaterMap = CreateMap(Lines, 12, 15);
        // WaterToLightMap = CreateMap(Lines, 18, 19);
        // LightToTemperatureMap = CreateMap(Lines, 22, 24);
        // TemperatureToHumidtiyMap = CreateMap(Lines, 27, 28);
        // HumidityToLocationMap = CreateMap(Lines, 31, 32);
    }

    private Map CreateMap(string[] lines, int startLine, int endLine)
    {
        var map = new Map();
        
        for (var i = startLine; i <= endLine; ++i)
        {
            map.AddInstruction(lines[i]);
        }

        return map;
    }

    public async Task PartOneAsync()
    {
        var location = Seeds.Select(s => SeedToLocation(s)).Min();

        Console.WriteLine($"Part 1: {location}");
    }

    public async Task PartTwoAsync()
    {
        var maps = new [] {
            SeedToSoilMap,
            SoilToFertilizerMap,
            FertilizerToWaterMap,
            WaterToLightMap,
            LightToTemperatureMap,
            TemperatureToHumidtiyMap,
            HumidityToLocationMap
        };

        var ranges = new List<Tuple<long, long>>();
        for (var i = 0; i < Seeds.Count-1; i += 2)
        {
            ranges.Add(new Tuple<long, long>(
                Seeds[i],
                Seeds[i] + Seeds[i+1] - 1
            ));
        }

        foreach(var map in maps)
        {
            var newRanges = new List<Tuple<long, long>>();
            foreach (var range in ranges)
            {
                var mappedRanges = map.MapRange(range);
                newRanges.AddRange(mappedRanges);
            }
            ranges = newRanges;
        }

        var location = ranges.Min(r => r.Item1);

        Console.WriteLine($"Part 2: {location}");
    }

    public long SeedToLocation(long seed)
    {
        return HumidityToLocationMap.MapValue(
            TemperatureToHumidtiyMap.MapValue(
                LightToTemperatureMap.MapValue(
                    WaterToLightMap.MapValue(
                        FertilizerToWaterMap.MapValue(
                            SoilToFertilizerMap.MapValue(
                                SeedToSoilMap.MapValue(seed)
                            )
                        )
                    )
                )
            )
        );
    }

    class Map
    {
        private List<Instruction> Instructions;

        public Map()
        {
            Instructions = new List<Instruction>();
        }

        public void AddInstruction(string instructionString)
        {
            Instructions.Add(new Instruction(instructionString));
            Instructions = Instructions.OrderBy(i => i.SourceStart).ToList();
        }

        public long MapValue(long source)
        {
            foreach (var i in Instructions)
            {
                var offset = source - i.SourceStart;

                if (offset < 0 || offset >= i.Range) continue;

                return i.DesintationStart + offset;
            }

            return source;
        }

        public List<Tuple<long, long>> MapRange(Tuple<long, long> range)
        {
            var start = range.Item1;
            var end = range.Item2;

            var mappedRanges = new List<Tuple<long, long>>();

            while (start < end)
            {
                var instruction = Instructions
                    .Where(i => start <= i.SourceEnd)
                    .FirstOrDefault();
                
                if (instruction == null)
                {
                    mappedRanges.Add(new Tuple<long, long>(start, end));
                    break;
                }

                if (start < instruction.SourceStart)
                {
                    mappedRanges.Add(new Tuple<long, long>(start, instruction.SourceStart-1));
                    start = instruction.SourceStart;
                }

                var rangeEnd = Math.Min(end, instruction.SourceEnd);

                var mappedStart = MapValue(start);
                var mappedEnd = MapValue(rangeEnd);

                mappedRanges.Add(new Tuple<long, long>(mappedStart, mappedEnd));

                start = rangeEnd + 1;
            }

            return mappedRanges;
        }
    }

    class Instruction
    {
        public long DesintationStart { get; set; }
        public long SourceStart { get; set; }
        public long Range { get; set; }
        public long SourceEnd { get; set; }

        public Instruction(string instructionString)
        {
            var parts = instructionString.Split(' ').Select(long.Parse).ToList();
            DesintationStart = parts[0];
            SourceStart = parts[1];
            Range = parts[2];
            SourceEnd = SourceStart + Range - 1;
        }
    }
}