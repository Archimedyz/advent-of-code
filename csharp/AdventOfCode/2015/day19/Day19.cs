public class Day19()
{
    public static async Task RunAsync()
    {
        var inputLines = await File.ReadAllLinesAsync("../../../2015/day19/input.txt");

        var molecule = inputLines.Last();

        var replacements = inputLines[..(inputLines.Length-2)];

        var map = new Dictionary<string, List<string>>();
        var reverseMap = new Dictionary<string, List<string>>();

        foreach (var r in replacements)
        {
            var parts = r.Split(" => ", StringSplitOptions.TrimEntries);

            string k = parts[0], v = parts[1];

            if (!map.ContainsKey(k))
            {
                map.Add(k, [v]);
            }
            else
            {
                map[k].Add(v);
            }
            
            if (!reverseMap.ContainsKey(v))
            {
                reverseMap.Add(v, [k]);
            }
            else
            {
                reverseMap[v].Add(k);
            }
        }

        var res1 = await SimulateReplacementsAsync(molecule, map);

        Console.WriteLine($"Part One: {res1.Count()}");

        var res2 = -1;

        var steps = 0;

        var startMolecules = new HashSet<string> {"e"};
        var endMolecules = new HashSet<string> {molecule};
        var alreadySeen = new HashSet<string>();

        while (steps < 10)
        {
            var newStartMoleculesTask = SimulateAllReplacementsAsync(startMolecules, map);
            var newEndMoleculesTask = SimulateAllReplacementsAsync(endMolecules, reverseMap);

            await Task.WhenAll(newStartMoleculesTask, newEndMoleculesTask);

            steps++;

            Console.WriteLine($"Finished step {steps}");

            var newStartMolecules = await newStartMoleculesTask;
            var newEndMolecules = await newEndMoleculesTask;

            var intersect = new HashSet<string>(newStartMolecules);
            intersect.IntersectWith(endMolecules);
            
            if (intersect.Any())
            {
                res2 = steps * 2 - 1;
                break;
            }
            
            intersect = new HashSet<string>(newStartMolecules);
            intersect.IntersectWith(newEndMolecules);

            if (intersect.Any())
            {
                res2 = steps * 2;
                break;
            }

            newStartMolecules.ExceptWith(alreadySeen);
            newStartMolecules.ExceptWith(alreadySeen);

            alreadySeen.UnionWith(startMolecules);
            alreadySeen.UnionWith(endMolecules);

            startMolecules = newStartMolecules;
            endMolecules = newEndMolecules;
        }

        Console.WriteLine($"Part Two: {res2}");
    }

    private static async Task<HashSet<string>> SimulateAllReplacementsAsync(
        HashSet<string> molecules,
        Dictionary<string, List<string>> replacements)
    {
        var tasks = molecules.Select(m => SimulateReplacementsAsync(m, replacements)).ToList();

        var taskResults = await Task.WhenAll(tasks);

        var res = taskResults.Aggregate(new HashSet<string>(), (a, b) => { a.UnionWith(b);return a;});

        return res;
    }

    private static async Task<HashSet<string>> SimulateReplacementsAsync(
        string molecule,
        Dictionary<string, List<string>> replacements)
    {
        var res = new HashSet<string>();

        foreach (var kv in replacements)
        {
            var key = kv.Key;
            var vals = kv.Value;

            for (int startIndex = 0, index = molecule.IndexOf(key, startIndex); index >= 0; startIndex = index + 1, index = molecule.IndexOf(key, startIndex))
            {
                foreach (var val in vals)
                {
                    var newMolecule = molecule.Remove(index, key.Length).Insert(index, val);
                    res.Add(newMolecule);
                }
            }
        }

        return res;
    }
}