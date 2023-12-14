using System.Data;

namespace Year2023;

class Day04
{
    private readonly string[] Lines;

    private readonly List<Card> Cards;

    public Day04()
    {
        Lines = File.ReadAllLines("../../../Year2023/Day04/input.txt");
        Cards = Lines.Select(l => new Card(l)).ToList();
    }

    public async Task PartOneAsync()
    {
        var sum = 0;

        foreach (var card in Cards)
        {
            var matches = card.NumberOfMaches;

            if (matches == 0) continue;

            sum += (int) Math.Pow(2, matches-1);
        }

        Console.WriteLine($"Part 1: {sum}");
    }

    public async Task PartTwoAsync()
    {
        var collectedCards = new Dictionary<int, int>();

        foreach(var card in Cards)
        {
            if (!collectedCards.ContainsKey(card.Id))
            {
                collectedCards[card.Id] = 1;
            }
            else
            {
                ++collectedCards[card.Id];
            }

            for (var i = 1; i <= card.NumberOfMaches; ++i)
            {
                var id = card.Id + i;
                if (!collectedCards.ContainsKey(id))
                {
                    collectedCards[id] = collectedCards[card.Id];
                }
                else
                {
                    collectedCards[id] += collectedCards[card.Id];
                }
            }
        }

        long sum = collectedCards.Aggregate(0l, (s, kv) => s + kv.Value);

        Console.WriteLine($"Part 2: {sum}");
    }

    private long? CollectedCards(Card card, Dictionary<int, long> map)
    {
        long sum = 1; // include the current card

        for (var i = 1; i <= card.NumberOfMaches; ++i)
        {
            if (!map.ContainsKey(card.Id + i)) return null;

            sum += map[card.Id + 1];
        }

        return sum;
    }

    class Card
    {
        public int Id { get; set; }
        public List<int> WinningNumbers { get; set; }
        public List<int> DrawnNumbers { get; set; }
        public int NumberOfMaches { get; set; }

        public Card(string cardString)
        {
            var parts = cardString.Split(':', '|');
            Id = int.Parse(parts[0].Substring(5));
            WinningNumbers = parts[1]
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Select(n => int.Parse(n))
                .ToList();
            DrawnNumbers = parts[2]
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Select(n => int.Parse(n))
                .ToList();
            NumberOfMaches = DrawnNumbers
                .Count(dn => WinningNumbers.Contains(dn));
        }
    }
}