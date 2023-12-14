public class Day23
{
    private readonly Dictionary<int, Instruction> instructions = [];

    private long RegisterA = 0;
    private int RegisterB = 0;

    public async Task RunAsync1()
    {
        RegisterA = 0;
        RegisterB = 0;

        await RunAsync();
    }
    
    public async Task RunAsync2()
    {
        RegisterA = 1; // collatz conjecture!
        RegisterB = 0;

        await RunAsync();
    }

    public async Task RunAsync()
    {
        var numberOfInstructions = await ReadInstructionsAsync();

        var currIndex = 0;
        var i = 0;
        
        while (currIndex >= 0 && currIndex < numberOfInstructions && RegisterB <= 248)
        {
            // if (i % 10 == 0)
            // {
                // await Task.Delay(500);
                // Console.WriteLine($"\tA: {RegisterA}, B: {RegisterB}");
                // Console.WriteLine($"\tinstruction {currIndex}: {instructions[currIndex].Raw}\n");
            // }

            instructions[currIndex].UpdateRegisterValue();
            currIndex += instructions[currIndex].NextInstruction();
        }

        Console.WriteLine($"A: {RegisterA}, B: {RegisterB}");
        Console.WriteLine($"total steps: {i}");
    }

    private async Task<int> ReadInstructionsAsync()
    {
        if (instructions.Any())
        {
            return instructions.Count();
        }

        var inputLines = await File.ReadAllLinesAsync("../../../2015/day23/input.txt");

        for (var i = 0; i < inputLines.Length; ++i)
        {
            var instruction = ParseInstruction(inputLines[i]);

            instructions.Add(i, instruction);
        }

        return instructions.Count();
    }

    private Instruction ParseInstruction(string input)
    {
        var parts = input.Split(' ');

        switch(parts[0].ToLowerInvariant())
        {
            case "hlf":
                return parts[1][0] == 'a'
                    ? new Instruction(() => RegisterA /= 2, () => 1, input)
                    : new Instruction(() => RegisterB /= 2, () => 1, input);
            case "tpl":
                return parts[1][0] == 'a'
                    ? new Instruction(() => RegisterA *= 3, () => 1, input)
                    : new Instruction(() => RegisterB *= 3, () => 1, input);
            case "inc":
                return parts[1][0] == 'a'
                    ? new Instruction(() => RegisterA += 1, () => 1, input)
                    : new Instruction(() => RegisterB += 1, () => 1, input);
            case "jmp":
                return new Instruction(() => {}, () => int.Parse(parts[1]), input);
            case "jie":
                return parts[1][0] == 'a'
                    ? new Instruction(() => {}, () => RegisterA % 2 == 0 ? int.Parse(parts[2]) : 1, input)
                    : new Instruction(() => {}, () => RegisterB % 2 == 0 ? int.Parse(parts[2]) : 1, input);
            case "jio":
                return parts[1][0] == 'a'
                    ? new Instruction(() => {}, () => RegisterA == 1 ? int.Parse(parts[2]) : 1, input)
                    : new Instruction(() => {}, () => RegisterB == 1 ? int.Parse(parts[2]) : 1, input);
            default:
                throw new Exception($"Unkonwn instruction: {input}");
        }
    }
}

class Instruction
{
    public readonly Action UpdateRegisterValue;
    public readonly Func<int> NextInstruction;

    public readonly string Raw;

    public Instruction(Action updateFunc, Func<int> nextFunc, string rawInput)
    {
        UpdateRegisterValue = updateFunc;
        NextInstruction = nextFunc;
        Raw = rawInput;
    }
}