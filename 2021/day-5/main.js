const fs = require('fs');

var lines = [];
var maxX = null, maxY = null;

function getPoint(xStr, yStr) {
    let p = {
        x: parseInt(xStr),
        y: parseInt(yStr)
    };

    if (maxX == null || p.x > maxX) {
        maxX = p.x;
    }
    if (maxY == null || p.y > maxY) {
        maxY = p.y;
    }

    return p;
}

function parseInput(rows) {
    for (let key in rows) {
        let parts = rows[key].match(/\d+/g);

        lines.push({
            p1: getPoint(parts[0], parts[1]),
            p2: getPoint(parts[2], parts[3])
        });
    }
}

function plotLine(grid, line) {
    let x = line.p1.x;
    let y = line.p1.y;
    let endX = line.p2.x;
    let endY = line.p2.y;

    let xInc = x <= endX ? 1 : -1;
    let yInc = y <= endY ? 1 : -1;

    while (x != endX || y != endY) {
        let i = maxY * x + y;
        if (!grid[i]) {
            grid[i] = 0;
        }
    
        ++grid[i];

        if (x != endX) {
            x += xInc;
        }
        if (y != endY) {
            y += yInc;
        }
    }

    // need to mark the end point since it ws not 
    // included in the above loop
    let index = maxY * endX + endY;
    if (!grid[index]) {
        grid[index] = 0;
    }

    ++grid[index];
}

function drawLines(allowDiagonal) {
    let grid = [];

    for (let key in lines) {
        let line = lines[key];
        
        if (!allowDiagonal && line.p1.x != line.p2.x && line.p1.y != line.p2.y) {
            continue;
        }

        plotLine(grid, line);
    }

    let res = 0;

    for (let key in grid) {
        if (grid[key] >= 2) {
            ++res;
        }
    }

    return res;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    
    let rows = data.split('\r\n');

    parseInput(rows);

    let res1 = drawLines(false);
    let res2 = drawLines(true);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});