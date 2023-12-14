const fs = require('fs');

function parseInput(data) {
    let lines = data.split('\r\n');

    let grid = [];

    for (let i = 0; i < lines.length; ++i) {
        let line = lines[i];
        let row = [];
        for (let j = 0; j < lines.length; ++j) {
            row.push(parseInt(line[j]));
        }
        grid.push(row);
    }

    return grid;
}

function isLowPoint(grid, i, j) {
    let adjLst = [
        {i: i - 1, j: j},
        {i: i + 1, j: j},
        {i: i, j: j - 1},
        {i: i, j: j + 1}
    ];

    let val = grid[i][j];

    for (let k in adjLst) {
        let adj = adjLst[k];
        if (adj.i < 0 || adj.j < 0 || adj.i >= grid.length || adj.j >= grid[i].length) {
            continue;
        }

        if (val >= grid[adj.i][adj.j]) {
            return false;
        }
    }

    return true;
}

function findBasinCenters(grid) {
    let centers = [];

    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[i].length; ++j) {
            if (isLowPoint(grid, i, j)) {
                centers.push({
                    i: i,
                    j: j
                });
            }
        }
    }
    
    return centers;
}

function findRisk(grid, points) {
    let sum = 0;

    for (let k in points) {
        let p = points[k];
        sum += 1 + grid[p.i][p.j];
    }

    return sum;
}

function findBasinSizes(grid, centers) {
    let sizes = [];

    for (let k in centers) {
        let visited = new Set();
        let queue = [centers[k]];
        let basinSize = 0;

        while (queue.length > 0) {
            let p = queue.pop();
            let key = p.i + ',' + p.j;

            // already visited
            if (visited.has(key)) {
                continue;
            }

            // point is out of bounds, don't consider it.
            if (p.i < 0 || p.j < 0 || p.i >= grid.length || p.j >= grid[p.i].length) {
                continue;
            }

            visited.add(key);

            // hit the end of the basin
            if (grid[p.i][p.j] >= 9) {
                continue;
            }

            ++basinSize;

            queue.push({i: p.i - 1, j: p.j});
            queue.push({i: p.i + 1, j: p.j});
            queue.push({i: p.i, j: p.j - 1});
            queue.push({i: p.i, j: p.j + 1});
        }

        sizes.push(basinSize);
    }

    return sizes;
}

function findBasinProduct(grid, centers) {
    let sizes = findBasinSizes(grid, centers).sort((a, b) => a - b);

    let a = sizes.pop();
    let b = sizes.pop();
    let c = sizes.pop();

    return a * b * c;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let grid = parseInput(data);

    let centers = findBasinCenters(grid);

    let res1 = findRisk(grid, centers);
    let res2 = findBasinProduct(grid, centers);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});