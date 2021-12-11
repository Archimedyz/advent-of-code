const fs = require('fs');

function incAndflash(grid, i, j, mod) {
    let octopus = grid[i][j];
    
    if (octopus.flashed && octopus.mod == mod) {
        return 0;
    }

    let flashes = 0;

    octopus.flashed = false;
    ++octopus.val;

    if (octopus.val > 9) {
        flashes += 1;
        octopus.flashed = true;
        octopus.val = 0;
        octopus.mod = mod;

        for (let h = -1; h <= 1; ++h) {
            if (i + h < 0 || i + h >= grid.length) {
                continue;
            }

            for (let k = -1; k <= 1; ++k) {
                if (j + k < 0 || j + k >= grid[i].length) {
                    continue;
                }

                flashes += incAndflash(grid, i + h, j + k, mod);
            }

        }
    }

    return flashes;
}

function countFlashes(grid, steps) {
    let flashes = 0;

    while (steps > 0) {
        for (let i = 0; i < grid.length; ++i) {
            for (let j = 0; j < grid[i].length; ++j) {
                flashes += incAndflash(grid, i, j, steps % 2);
            }
        }

        --steps;
    }

    return flashes;
}

function findSyncStep(grid) {
    let step = 1;

    let totalOctopuses = grid.length * grid[0].length;

    while (true) {
        let flashes = 0;
        for (let i = 0; i < grid.length; ++i) {
            for (let j = 0; j < grid[i].length; ++j) {
                flashes += incAndflash(grid, i, j, step % 2);
            }
        }

        if (flashes == totalOctopuses) {
            return step;
        }

        ++step;
    }
}

function parseInput(data) {
    let grid = [];

    let lines = data.split("\r\n");

    for (let i in lines) {
        let row = [];

        for (let j in lines[i]) {
            let octopus = {
                val: parseInt(lines[i][j]),
                flashed: false,
                mod: 0
            }

            row.push(octopus);
        }

        grid.push(row);
    }

    return grid;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let grid1 = parseInput(data);
    let grid2 = parseInput(data);

    let res1 = countFlashes(grid1, 100);
    let res2 = findSyncStep(grid2);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});