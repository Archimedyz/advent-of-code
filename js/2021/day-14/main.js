const fs = require('fs');

function getNode(state, key) {
    if (!state[key]) {
        state[key] = {
            quantity: 0
        }
    }

    return state[key];
}

function parseInput(data) {
    let lines = data.split("\r\n");

    let state = {};
    for (let i = 1; i < lines[0].length; ++i) {
        let key = lines[0][i-1] + lines[0][i];
        let node = getNode(state, key);
        node.quantity += 1;
    }
    
    let rules = {};

    for (let i = 2; i < lines.length; ++i) {
        let parts = lines[i].split(' -> ');
        rules[parts[0]] = parts[1];
    }

    return {
        state: state,
        rules: rules,
        first: lines[0][0],
        last: lines[0][lines[0].length-1]
    }
}

function getCounts(state, first, last) {
    let countMap = {};

    // add up the quatities for each char
    // note that single char appears in two nodes:
    // once as the left part of the key, and the 
    // other as the right. The only excpetions are 
    // the first and last chars or polymer.
    for (let k in state) {
        let node = state[k];
        let l = k[0];
        let r = k[1];

        if (!countMap[l]) {
            countMap[l] = 0;
        }
        
        if (!countMap[r]) {
            countMap[r] = 0;
        }

        countMap[l] += node.quantity;
        countMap[r] += node.quantity;
    }

    // now for the first and last values, we will increment
    // the counts, as will be dividing the sums by 2 later.
    countMap[first] += 1;
    countMap[last] += 1;
    
    let counts = [];

    for (let k in countMap) {
        counts.push(countMap[k] / 2);
    }

    return counts;
}

function processPolymer(state, rules) {
    let newState = {};

    for (let key in state) {
        let node = state[key];
        let char = rules[key];

        let lKey = key[0] + char;
        let rKey = char + key[1];

        let lNode = getNode(newState, lKey);
        let rNode = getNode(newState, rKey);

        lNode.quantity += node.quantity;
        rNode.quantity += node.quantity;
    }

    return newState;
}

function getPolymerScore(state, rules, first, last, steps) {
    let currState = state;
    for (let s = 0; s < steps; ++s) {
        currState = processPolymer(currState, rules);
    }

    let counts = getCounts(currState, first, last).sort((a, b) => a - b);

    let min = counts[0];
    let max = counts.pop();

    return max - min;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }
    let input = parseInput(data);

    let res1 = getPolymerScore(input.state, input.rules, input.first, input.last, 10);
    let res2 = getPolymerScore(input.state, input.rules, input.first, input.last, 40);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});
