public class Day24()
{
    public static async Task RunAsync()
    {
        var inputLines = await File.ReadAllLinesAsync("../../../2015/day24/input.txt");
        
        //inputLines = ["1", "2", "3", "4", "5", "7", "8", "9", "10", "11"];

        var weights = inputLines.Select(l => int.Parse(l));

        var totalWeight = weights.Sum();

        var weightPerSection = totalWeight / 3;

        Console.WriteLine($"total: {totalWeight}, per section: {weightPerSection}");

        var arrangements = await BuildArrangements(weights, weightPerSection);

        PrintArangements(arrangements);

        var winner = arrangements.OrderBy(a => a.OptimalGroup.Size).ThenBy(a => a.OptimalGroup.QuantumValue).First();

        PrintArangements([winner]);
        
        Console.WriteLine($"Part one: {winner.OptimalGroup.QuantumValue}");
    }

    private static void PrintArangements(IEnumerable<Arrangement> arrangements)
    {
        Console.WriteLine(">>>");
        foreach (var a in arrangements)
        {
            Console.WriteLine($"\t{a}");
        }
        Console.WriteLine("<<<");
    }

    public async static Task<IEnumerable<Arrangement>> BuildArrangements(IEnumerable<int> weights, int weightPerGroup)
    {
        var remaining = new Stack<int>(weights);
        var arrangements = new List<Arrangement>{new Arrangement()};

        while (remaining.Any())
        {
            var w = remaining.Pop();

            var newArrangements = new List<Arrangement>();

            foreach (var a in arrangements)
            {
                var clone1 = a.Clone();

                if (clone1.A.TotalWeight + w <= weightPerGroup) {
                    clone1.A.Add(w);
                    newArrangements.Add(clone1);
                }

                if (a.UsedGroups < 1) continue;

                var clone2 = a.Clone();

                if (clone2.B.TotalWeight + w <= weightPerGroup) {
                    clone2.B.Add(w);
                    newArrangements.Add(clone2);
                }
                
                if (a.UsedGroups < 2) continue;

                var clone3 = a.Clone();
                
                if (clone3.C.TotalWeight + w <= weightPerGroup) {
                    clone3.C.Add(w);
                    newArrangements.Add(clone3);
                }
            }

            arrangements = newArrangements;
        }

        return arrangements.Where(a => a.AllEqualWeights && a.A.TotalWeight == weightPerGroup);
    }
}

public class Arrangement
{
    public Group A { get; } = new Group();
    public Group B { get; } = new Group();
    public Group C { get; } = new Group();

    public bool AllEqualWeights =>
        A.TotalWeight == B.TotalWeight &&
        A.TotalWeight == C.TotalWeight;

    public int UsedGroups => 
        (A.TotalWeight > 0 ? 1 : 0) +
        (B.TotalWeight > 0 ? 1 : 0) +
        (C.TotalWeight > 0 ? 1 : 0);

    public Group OptimalGroup => Group.MostOptimal(
            A,
            Group.MostOptimal(B, C)
        );

    public Arrangement() {}

    private Arrangement(Arrangement other)
    {
        A = other.A.Clone();
        B = other.B.Clone();
        C = other.C.Clone();
    }

    public Arrangement Clone()
    {
        return new Arrangement(this);
    }

    public override string ToString()
    {
        return $"A: {A}, B: {B}, C: {C}";
    }
}

public class Group
{
    public List<int> Weights { get; } = new List<int>();

    public int Size => Weights.Count();

    public int TotalWeight { get; private set; } = 0;

    // quantum entanglement value
    public int QuantumValue { get; private set; } = 1;

    public Group() {}

    private Group(Group other)
    {
        Weights.AddRange(other.Weights);
        TotalWeight = other.TotalWeight;
        QuantumValue = other.QuantumValue;
    }

    public Group Clone()
    {
        return new Group(this);
    }

    public void Add(int weight)
    {
        Weights.Add(weight);
        TotalWeight += weight;
        QuantumValue *= weight;
    }

    public override string ToString()
    {
        return $"[{string.Join(',', Weights)}]";
    }

    public static Group MostOptimal(Group a, Group b)
    {
        if (a.Size < b.Size)
        {
            return a;
        }

        if (a.Size > b.Size)
        {
            return b;
        }

        return a.QuantumValue <= b.QuantumValue ? a : b;
    }
}