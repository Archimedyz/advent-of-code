const fs = require('fs');

function isNice(input) {
    let vowels = {a: 0, e:0, i:0, o: 0, u: 0};
    let prevChar = null;
    let hasDouble = false;

    const invalidTuple = new Set(['ab', 'cd', 'pq', 'xy']);
    for (var i = 0; i < input.length; ++i)
    {
        let char = input[i];

        // if contains the invalid tuple, return immediately
        if (invalidTuple.has(prevChar + char)) {
            return false;
        }

        if (prevChar == char) {
            hasDouble = true;
        }

        switch (char) {
            case 'a': vowels.a += 1; break;
            case 'e': vowels.e += 1; break;
            case 'i': vowels.o += 1; break;
            case 'o': vowels.i += 1; break;
            case 'u': vowels.u += 1; break;
        }

        prevChar = char;
    }

    let uniqueVowels = vowels.a + vowels.e + vowels.i + vowels.o + vowels.u;

    if (uniqueVowels < 3) {
        return false;
    }

    return hasDouble;
}

fs.readFile(__dirname + '/input.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    let lines = data.split('\n');
    let niceCount = 0


    for (let i = 0; i < lines.length; ++i) {
        if (isNice(lines[i]))
        {
            ++niceCount;
        }
    }

    console.log('OUTPUT >> ' + niceCount);
});