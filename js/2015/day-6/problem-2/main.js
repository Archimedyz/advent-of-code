const fs = require('fs');

var grid = new Array(1000*1000);
for (let i = 0; i < grid.length; ++i) {
    grid[i] = 0;
}

function toggle(x, y) {
    let i = x + 1000*y;
    grid[i] += 2;
}

function turnOn(x, y) {
    let i = x + 1000*y;
    ++grid[i];
}

function turnOff(x, y) {
    let i = x + 1000*y;
    if (grid[i] == 0) {
        return;
    }
    --grid[i];
}

function getCoords(str)
{
    let parts = str.split(' through ');

    let p1 = parts[0].split(',');
    let p2 = parts[1].split(',');

    let x1 = parseInt(p1[0]);
    let y1 = parseInt(p1[1]);
    let x2 = parseInt(p2[0]);
    let y2 = parseInt(p2[1]);

    if (x1 > x2) {
        let xt = x1;
        x1 = x2;
        x2 = xt;
    }
    
    if (y1 > y2) {
        let yt = y1;
        y1 = y2;
        y2 = yt;
    }

    return {
        start: { x: x1, y: y1 },
        end: { x: x2, y: y2 }
    };
}

fs.readFile(__dirname + '/input.txt', 'utf8', (err, data) => {
    
    if (err) {
        console.log(err);
        return;
    }
    
    let rows = data.split('\n'); 

    for (let i = 0; i < rows.length; ++i) {
        let row = rows[i];

        let func = toggle;
        let skip = 7;

        if (row.startsWith('turn on')) {
            func = turnOn;
            skip = 8;
        }
        else if (row.startsWith('turn off')) {
            func = turnOff;
            skip = 9;
        }

        var coords = getCoords(row.substring(skip));

        for (let x = coords.start.x; x <= coords.end.x; ++x) {
            for (let y = coords.start.y; y <= coords.end.y; ++y) {
                func(x, y);
            }
        }
    }

    let count = 0;
    for (let i = 0; i < grid.length; ++i) {
        count += grid[i];
    }

    console.log("OUTPUT >> " + count);
});
