namespace Year2023;

class Day03 {

    private readonly string[] Lines;
    private readonly Dictionary<int, List<PartNumber>> PartNumbers;
    private readonly List<Tuple<int, int>> SymbolCoords;

    public Day03()
    {
        Lines = File.ReadAllLines("../../../Year2023/Day03/input.txt");
        PartNumbers = new Dictionary<int, List<PartNumber>>();
        SymbolCoords = new List<Tuple<int, int>>();
        for (var row = 0; row < Lines.Length; ++row)
        {
            string numStr = null;
            var startCol = 0;

            PartNumbers[row] = new List<PartNumber>();

            for (var col = 0; col < Lines[row].Length; ++col)
            {
                var c = Lines[row][col];

                if (char.IsDigit(c))
                {
                    if (numStr == null)
                    {
                        startCol = col;
                        numStr = "";
                    }
                    numStr += c;
                    continue;
                }
                else if (c != '.')
                {
                    SymbolCoords.Add(new Tuple<int, int>(row, col));
                }

                if (numStr != null)
                {
                    var num = int.Parse(numStr);
                    PartNumbers[row].Add(new PartNumber{
                        Value = num,
                        Row = row,
                        ColStart = startCol,
                        ColEnd = col-1
                    });
                    numStr = null;
                }
            }
            
            if (numStr != null)
            {
                var num = int.Parse(numStr);
                PartNumbers[row].Add(new PartNumber{
                    Value = num,
                    Row = row,
                    ColStart = startCol,
                    ColEnd = Lines[row].Length - 1
                });
            }
        }
    }

    public async Task PartOneAsync()
    {
        var set = new HashSet<PartNumber>();

        foreach (var coords in SymbolCoords)
        {
            var row = coords.Item1;
            var col = coords.Item2;

            for (var r = row - 1; r <= row + 1; ++r)
            {
                if (r < 0 || r >= Lines.Length) continue;
                
                for (var c = col - 1; c <= col + 1; ++c)
                {
                    if (c < 0 || c >= Lines[r].Length) continue;
                    
                    if (char.IsDigit(Lines[r][c]))
                    {
                        var partNum = PartNumbers[r]
                            .Where(pn => c >= pn.ColStart && c <= pn.ColEnd)
                            .FirstOrDefault();
                        
                        if (partNum != null)
                        {
                            set.Add(partNum);
                        }
                    }
                }   
            }
        }

        var sum = set.Sum(e => e.Value);

        Console.WriteLine($"Part 1: {sum}");
    }

    public async Task PartTwoAsync()
    {
        var sum = 0;

        foreach (var coords in SymbolCoords)
        {
            var row = coords.Item1;
            var col = coords.Item2;

            if (Lines[row][col] != '*') continue;

            var surroundingNums = new HashSet<PartNumber>();

            for (var r = row - 1; r <= row + 1; ++r)
            {
                if (r < 0 || r >= Lines.Length) continue;
                
                for (var c = col - 1; c <= col + 1; ++c)
                {
                    if (c < 0 || c >= Lines[r].Length) continue;
                    
                    if (char.IsDigit(Lines[r][c]))
                    {
                        var partNum = PartNumbers[r]
                            .Where(pn => c >= pn.ColStart && c <= pn.ColEnd)
                            .FirstOrDefault();
                        
                        if (partNum != null)
                        {
                            surroundingNums.Add(partNum);
                        }
                    }
                }   
            }

            if (surroundingNums.Count == 2)
            {
                sum += surroundingNums.First().Value * surroundingNums.Last().Value;
            }
        }

        Console.WriteLine($"Part 2: {sum}");
    }

    class PartNumber
    {
        public int Value { get; set; }
        public int Row { get; set; }
        public int ColStart { get; set; }
        public int ColEnd { get; set; }
    }
}