const fs = require('fs');

function calculateFuel(positions, target, isLinear) {
    let fuel = 0;

    for (let k in positions) {
        let p = positions[k];
        
        let dist = p < target 
            ? target - p
            : p - target;

        fuel += isLinear
            ? dist
            : (dist * (dist + 1) / 2);
    }

    return fuel;
}

function minFuelCost(positions, min, max, isLinear) {
    let minFuel = null;

    for (let pos = min; pos <= max; ++pos) {
        let fuel = calculateFuel(positions, pos, isLinear);

        if (minFuel == null || minFuel > fuel) {
            minFuel = fuel;
        }
    }

    return minFuel;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let strs = data.split(',');

    let positions = [];
    let min = null, max = null;
    
    for (let key in strs) {
        let val = parseInt(strs[key]);
        positions.push(val);

        if (min == null || min > val) {
            min = val;
        }
        
        if (max == null || max < val) {
            max = val;
        }
    }

    let res1 = minFuelCost(positions, min, max, true);
    let res2 = minFuelCost(positions, min, max, false);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});