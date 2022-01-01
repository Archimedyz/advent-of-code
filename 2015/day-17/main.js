const fs = require('fs');

function parseInput(data) {
    let arr = [];

    let lines = data.split('\r\n');
    for (let i in lines) {
        arr.push(parseInt(lines[i]));
    }

    return arr.sort((a, b) => a - b);
}

function findCombinations(amount, buckets, used) {
    if (buckets.length == 0) {
        return [];
    }

    let remainingBuckets = [...buckets];
    let bucket = remainingBuckets.pop();

    let combinationsWithBucket = [];
    if (amount == bucket) {
        combinationsWithBucket = [[...used, bucket]];
    }
    else if (amount > bucket) {
        combinationsWithBucket = findCombinations(amount - bucket, remainingBuckets, [...used, bucket]);
    }

    let combinationsWithoutBucket = findCombinations(amount, remainingBuckets, used);

    return [...combinationsWithBucket, ...combinationsWithoutBucket];
}

function findSmallestCombinations(arr) {
    let minKey = null;
    let map = {};

    for (let a in arr) {
        let key = arr[a].length;

        if (!map[key]) {
            map[key] = 0;
        }

        ++map[key];

        if (minKey == null || minKey > key) {
            minKey = key;
        }
    }

    return map[minKey];
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let arr = parseInput(data);
    
    let combos = findCombinations(150, arr, []);

    let res1 = combos.length;
    let res2 = findSmallestCombinations(combos);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});
