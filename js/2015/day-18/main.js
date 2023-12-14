const fs = require('fs');

function parseInput(data) {
    let grid = [];

    let lines = data.split('\r\n');
    for (let i in lines) {
        let row = [];

        for (let j in lines[i]) {
            row.push(lines[i][j] == '#' ? 1 : 0);
        }

        grid.push(row);
    }

    return grid;
}

function countLights(grid) {
    let count = 0;

    for (let i in grid) {
        for (let j in grid[i]) {
            count += grid[i][j];
        }
    }

    return count;
}

function copyGrid(grid) {
    let newGrid = [];

    for (let k in grid) {
        newGrid.push([...grid[k]]);
    }

    return newGrid;
}

function processLight(grid, i, j) {
    let light = grid[i][j];
    
    let on = 0;

    for (let di = -1; di <= 1; ++di) {
        let ni = i + di;
        
        if (ni < 0 || ni >= grid.length) {
            continue;
        }
        
        for (let dj = -1; dj <= 1; ++dj) {
            let nj = j + dj;
            if (nj < 0 || nj >= grid[ni].length || di == 0 && dj == 0) {
                continue;
            }

            on += grid[ni][nj];
        }
    }

    if (light == 1 && [2, 3].includes(on)) {
        return 1;
    }
    else if (light == 0 && on == 3) {
        return 1;
    }

    return 0;
}

function processGrid(grid) {
    let _grid = [];
    
    for (let i = 0; i < grid.length; ++i) {
        let row = [];
        
        for (let j = 0; j < grid[i].length; ++j) {
            let light = processLight(grid, i, j);

            row.push(light);
        }

        _grid.push(row);
    }

    return _grid;
}

function animateGrid(grid, steps, cornersOn) {
    let maxi = grid.length - 1;
    let maxj = grid[maxi].length - 1;
    
    let _grid = copyGrid(grid);

    if (cornersOn) {
        _grid[0][0] = 1;
        _grid[0][maxj] = 1;
        _grid[maxi][0] = 1;
        _grid[maxi][maxj] = 1;
    }

    while (steps > 0) {
        _grid = processGrid(_grid);
    
        if (cornersOn) {
            _grid[0][0] = 1;
            _grid[0][maxj] = 1;
            _grid[maxi][0] = 1;
            _grid[maxi][maxj] = 1;
        }

        --steps;
    }

    return _grid;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let grid = parseInput(data);

    let grid1 = animateGrid(grid, 100, false);
    let grid2 = animateGrid(grid, 100, true);

    let res1 = countLights(grid1);
    let res2 = countLights(grid2);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});
