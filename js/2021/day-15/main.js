const fs = require('fs');
const { Heap } = require('heap-js');

function parseInput(data) {
    let lines = data.split("\r\n");

    let grid = [];

    for (let i in lines) {
        let row = [];

        for (let j in lines[i]) {
            row.push(parseInt(lines[i][j]));
        }

        grid.push(row);
    }

    return grid;
}

function extendGrid(grid, n) {
    let nGrid = [];

    let h = grid.length;
    let w = grid[0].length;
    
    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[i].length; ++j) {
            let currVal = grid[i][j];
            for (let di = 0; di < n; ++di) {
                for (let dj = 0; dj < n; ++dj) {
                    let dVal = currVal + di + dj;

                    // note that this would fail if n was greater than 9
                    if (dVal > 9) {
                        dVal -= 9;
                    }

                    let ni = i + h * di;
                    let nj = j + w * dj;
                    
                    if (!nGrid[ni]) {
                        nGrid[ni] = [];
                    }

                    nGrid[ni][nj] = dVal;
                }
            }
        }
    }

    return nGrid;
}

function getNeighbors(grid, point) {
    let neighbors = [];

    for (let d = -1; d <= 1; d += 2) {
        di = d + point.i;
        if (di >= 0 && di < grid.length) {
            neighbors.push({ i: di, j: point.j });
        }

        dj = d + point.j;
        if (dj >= 0 && dj < grid[point.i].length) {
            neighbors.push({ i: point.i, j: dj });
        }
    }
    
    return neighbors;
}

function findLowestRisk(grid, start, end) {
    let riskMap = [];
    for (let i in grid) {
        let row = [];
        for (let j in grid[i]) {
            row.push(null);
        }
        riskMap.push(row);
    }

    riskMap[start.i][start.j] = 0;

    let comparator = (a, b) => riskMap[a.i][a.j] - riskMap[b.i][b.j];

    let unvisited = new Heap(comparator);
    unvisited.push(start);

    let visited = new Set();
    let willVisit = new Set();

    let endKey = end.i + ',' + end.j;

    while (unvisited.length > 0 && !visited.has(endKey)) {
        let p = unvisited.pop();
        visited.add(p.i + ',' + p.j);

        let neighbors = getNeighbors(grid, p);

        for (let k in neighbors) {
            let n = neighbors[k];

            let oldRisk = riskMap[n.i][n.j];
            let newRisk = riskMap[p.i][p.j] + grid[n.i][n.j];

            if (oldRisk == null || oldRisk > newRisk) {
                riskMap[n.i][n.j] = newRisk;
            }
            let nKey = n.i + ',' + n.j;
            if (visited.has(nKey) || willVisit.has(nKey)) {
                continue;
            }

            unvisited.push(n);
            willVisit.add(nKey);
        }
    }

    return riskMap[end.i][end.j];
}

function print(grid) {
    let str = '';

    for (let k in grid) {
        str += grid[k].join(' ') + '\n';
    }

    console.log(str);
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let grid = parseInput(data);
    let extendedGrid = extendGrid(grid, 5);

    let start = { i: 0, j: 0 };
    let end = { i: grid.length - 1, j: grid[0].length - 1 };
    let extendedEnd = { i: extendedGrid.length - 1, j: extendedGrid[0].length - 1 };

    let res1 = findLowestRisk(grid, start, end);
    let res2 = findLowestRisk(extendedGrid, start, extendedEnd);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});
