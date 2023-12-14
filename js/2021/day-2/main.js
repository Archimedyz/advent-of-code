const fs = require('fs');
const { exit } = require('process');

function process1(rows) {

    let dist = 0;
    let depth = 0;

    for (let i = 0; i < rows.length; ++i)
    {
        let parts = rows[i].split(' ');

        let val = parseInt(parts[1]);

        switch (parts[0]) {
            case 'forward': dist += val; break;
            case 'down': depth += val; break;
            case 'up': depth -= val; break;
            default: console.error('Unexpected command: "' + parts[1] + '"'); exit(1);
        }
    }

    return dist * depth;
}

function process2(rows) {

    let dist = 0;
    let depth = 0;
    let aim = 0;

    for (let i = 0; i < rows.length; ++i)
    {
        let parts = rows[i].split(' ');

        let val = parseInt(parts[1]);

        switch (parts[0]) {
            case 'forward':
                dist += val;
                depth += aim * val;
                break;
            case 'down': aim += val; break;
            case 'up': aim -= val; break;
            default: console.error('Unexpected command: "' + parts[1] + '"'); exit(1);
        }
    }

    return dist * depth;
}

fs.readFile(__dirname + '/input.txt', 'utf8', (err, data) => {
    
    if (err) {
        console.log(err);
        return;
    }
    
    let rows = data.split('\r\n');

    let res1 = process1(rows);

    let res2 = process2(rows);
    
    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});
