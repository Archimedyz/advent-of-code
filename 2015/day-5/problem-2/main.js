const fs = require('fs');

function isNice(input) {
    if (input.length < 3) {
        return false;
    }

    let hasDoublePair = false;
    let hasPalindrome = false;

    for (let j = 1; j < input.length - 1; ++j) {
        let i = j - 1;
        let k = j + 1;
        let pair = input[i] + input[j];

        if (!hasDoublePair) {
            var rem = input.substring(j+1);
            if (rem.includes(pair))
            {
                hasDoublePair = true;
            }
        }

        if (!hasPalindrome) {
            if (input[i] == input [k]) {
                hasPalindrome = true;
            }
        }

        if (hasDoublePair && hasPalindrome) {
            return true;
        }
    }


    return false;
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