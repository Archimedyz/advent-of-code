using Microsoft.VisualBasic;

namespace Year2023;

class Day08
{
    private readonly string[] Lines;

    private readonly string Instructions;
    private readonly Dictionary<string, Node> Nodes;

    public Day08()
    {
        Lines = File.ReadAllLines("../../../Year2023/Day08/input.txt");
        Instructions = Lines[0];
        Nodes = new Dictionary<string, Node>();

        for (var i = 2; i < Lines.Count(); ++i)
        {
            var node = new Node(Lines[i]);
            Nodes.Add(node.Id, node);
        }
    }

    public async Task PartOneAsync()
    {
        var totalSteps = 0;
        var step = 0;
        var curr = "AAA";
        var target = "ZZZ";
        while (!curr.Equals(target))
        {
            totalSteps++;

            var node = Nodes[curr];

            switch (Instructions[step])
            {
                case 'R': curr = node.Right; break;
                case 'L': curr = node.Left; break;
            }
            
            if (++step >= Instructions.Length) step = 0;
        }

        Console.WriteLine($"Part 1: {totalSteps}");
    }

    public async Task PartTwoAsync()
    {
        long sum = 0;

        Console.WriteLine($"Part 2: {sum}");
    }

    class Node
    {
        public string Id { get; set; }
        public string Left { get; set; }
        public string Right { get; set; }
        public Node(string input)
        {
            var parts = input.Split(new []{' ', '=', '(', ')', ','}, StringSplitOptions.RemoveEmptyEntries);
            Id = parts[0];
            Left = parts[1];
            Right = parts[2];
        }
    }
}