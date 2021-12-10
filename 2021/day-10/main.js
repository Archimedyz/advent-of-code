const fs = require('fs');
const { isError } = require('util');

let errorScoring = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
}

let completionScoring = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
}

let map = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
}

let keys = new Set(['(','[','{','<']);

function parseInput(data) {
    return data.split('\r\n');
}

function findScores(rows) {
    let errorScore = 0;
    let completionScores = [];

    for (let i in rows) {
        let row = rows[i];

        let stack = [];

        isErr = false;

        for (let j in row) {
            let c = row[j];

            // if a chunk is opened, add to stack.
            if (keys.has(c)) {
                stack.push(c);
                continue;
            }

            // need to match the closing characte
            // to the opening chunk character
            let opener = stack.pop();

            if (map[opener] != c) {
                errorScore += errorScoring[c];
                isErr = true;
                break;
            }
        }

        // line was not an error, just incomplete
        if (!isErr) {
            let cScore = 0;
            
            while (stack.length > 0) {
                let opener = stack.pop();
                let closer = map[opener];

                cScore *= 5;
                cScore += completionScoring[closer];
            }

            completionScores.push(cScore);
        }
    }

    let midIndex = (completionScores.length - 1) / 2;
    let middleScore = completionScores.sort((a, b) => a - b)[midIndex];

    return {
        error: errorScore,
        middle: middleScore
    };
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let rows = parseInput(data);

    let scores = findScores(rows);

    let res1 = scores.error;
    let res2 = scores.middle;

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});