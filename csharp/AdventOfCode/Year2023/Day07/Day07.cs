namespace Year2023;

class Day07
{
    private readonly string[] Lines;

    private readonly List<Hand> Hands;

    public Day07()
    {
        Lines = File.ReadAllLines("../../../Year2023/Day07/input.txt");

        Hands = Lines.Select(l => new Hand(l)).ToList();
    }

    public async Task PartOneAsync()
    {
        long sum = 0;

        Hand.UseJokers = false;
        Hands.Sort();

        for (var i = 0; i < Hands.Count; ++i)
        {
            var hand = Hands[i];

            sum += (i+1) * hand.Bid;
        }

        Console.WriteLine($"Part 1: {sum}");
    }

    public async Task PartTwoAsync()
    {
        long sum = 0;

        Hand.UseJokers = true;
        Hands.Sort();

        for (var i = 0; i < Hands.Count; ++i)
        {
            var hand = Hands[i];

            sum += (i+1) * hand.Bid;
        }

        Console.WriteLine($"Part 2: {sum}");
    }

    class Hand: IComparable
    {
        public string Cards { get; set; }

        public long Bid { get; set; }

        public string OrderedCards { get; set; }

        public static bool UseJokers = false;

        private readonly Dictionary<char, int> CardValues = new Dictionary<char, int>
        {
            {'2',  2},
            {'3',  3},
            {'4',  4},
            {'5',  5},
            {'6',  6},
            {'7',  7},
            {'8',  8},
            {'9',  9},
            {'T', 10},
            {'J', 11},
            {'Q', 12},
            {'K', 13},
            {'A', 14}
        };
        private readonly Dictionary<char, int> JokerCardValues = new Dictionary<char, int>
        {
            {'J',  1},
            {'2',  2},
            {'3',  3},
            {'4',  4},
            {'5',  5},
            {'6',  6},
            {'7',  7},
            {'8',  8},
            {'9',  9},
            {'T', 10},
            {'Q', 12},
            {'K', 13},
            {'A', 14}
        };

        public Hand(string rawString)
        {
            var parts = rawString.Split(' ', StringSplitOptions.TrimEntries);

            Cards = parts[0];
            Bid = int.Parse(parts[1]);

            OrderedCards = Cards.ToCharArray().Order().Aggregate("", (s, c) => s + c);
        }

        public int CompareTo(object? obj)
        {
            var other = obj as Hand;

            if (other == null) throw new ArgumentException("Cannot compare Hand to other objects!");

            // compare hands
            var myType = GetHandType(this, UseJokers);
            var otherType = GetHandType(other, UseJokers);

            if (myType < otherType) return -1;

            if (myType > otherType) return 1;

            // individual card comparison
            for (var i = 0; i < Cards.Length; ++i)
            {
                var myCard = Cards[i];
                var otherCard = other.Cards[i];

                if (myCard == otherCard) continue;

                return UseJokers 
                    ? (JokerCardValues[myCard] < JokerCardValues[otherCard] ? -1 : 1)
                    : (CardValues[myCard] < CardValues[otherCard] ? -1 : 1);
            }

            return 0;
        }
        
        private static HandType GetHandType(Hand hand)
        {
            var pairs = 0;
            var triples = 0;

            var i = 0;
            while (i < hand.OrderedCards.Length)
            {
                var count = hand.OrderedCards.Count(c => c == hand.OrderedCards[i]);

                switch (count)
                {
                    case 5: return HandType.FiveOfAKind;
                    case 4: return HandType.FourOfAKind;
                    case 3: triples++; break;
                    case 2: pairs++; break;
                }

                i += count;
            }

            if (triples == 1)
            {
                return pairs == 1
                    ? HandType.FullHouse
                    : HandType.ThreeOfAKind;
            }

            switch (pairs)
            {
                case 2: return HandType.TwoPair;
                case 1: return HandType.OnePair;
                default: return HandType.HighCard;
            }
        }

        private static Dictionary<HandType, HandType> OneJokerMap = new Dictionary<HandType, HandType>{
            {HandType.HighCard, HandType.OnePair},
            {HandType.OnePair, HandType.ThreeOfAKind},
            {HandType.TwoPair, HandType.FullHouse},
            {HandType.ThreeOfAKind, HandType.FourOfAKind},
            // {HandType.FullHouse, HandType.FullHouse}, // impossible
            {HandType.FourOfAKind, HandType.FiveOfAKind},
            // {HandType.FiveOfAKind, HandType.FiveOfAKind}, // impossible
        };

        /*
         * Need to be careful here. If I have a one pair, it's already the jokers!
         */
        private static Dictionary<HandType, HandType> TwoJokerMap = new Dictionary<HandType, HandType>{
            // {HandType.HighCard, HandType.HighCard}, // impossible
            {HandType.OnePair, HandType.ThreeOfAKind},
            {HandType.TwoPair, HandType.FourOfAKind},
            // {HandType.ThreeOfAKind, HandType.ThreeOfAKind}, // impossible
            {HandType.FullHouse, HandType.FiveOfAKind},
            // {HandType.FourOfAKind, HandType.FourOfAKind}, // impossible
            // {HandType.FiveOfAKind, HandType.FiveOfAKind}, // impossible
        };
        private static Dictionary<HandType, HandType> ThreeJokerMap = new Dictionary<HandType, HandType>{
            // {HandType.HighCard, HandType.HighCard}, // impossible
            // {HandType.OnePair, HandType.OnePair}, // impossible
            // {HandType.TwoPair, HandType.TwoPair}, // impossible
            {HandType.ThreeOfAKind, HandType.FourOfAKind},
            {HandType.FullHouse, HandType.FiveOfAKind},
            // {HandType.FourOfAKind, HandType.FourOfAKind}, // impossible
            // {HandType.FiveOfAKind, HandType.FiveOfAKind}, // impossible
        };

        private static HandType GetHandType(Hand hand, bool withJokers)
        {
            var originalHandType = GetHandType(hand);

            if (!withJokers) return originalHandType;

            var jokers = hand.Cards.Count(c => c == 'J');

            switch(jokers)
            {
                case 5:
                case 4:
                    return HandType.FiveOfAKind;
                case 3:
                    return ThreeJokerMap[originalHandType];
                case 2:
                    return TwoJokerMap[originalHandType];
                case 1:
                    return OneJokerMap[originalHandType];
                default:
                    return originalHandType;
            }
        }
    }

    enum HandType
    {
        HighCard = 0,
        OnePair = 1,
        TwoPair = 2,
        ThreeOfAKind = 3,
        FullHouse = 4,
        FourOfAKind = 5,
        FiveOfAKind = 6
    }
}