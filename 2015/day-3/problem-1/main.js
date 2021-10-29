const fs = require('fs');

fs.readFile(__dirname + '/input.txt', 'utf8' , (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    var houses = new Set();
    var currPos = [0, 0];

    // insert the starting position
    houses.add(currPos[0] + ',' + currPos[1]);

    for (var i = 0; i < data.length; ++i)
    {
        var dir = data[i];
        if (dir == '>'){
            currPos[0] += 1;
        }
        else if (dir == '<') {
            currPos[0] -= 1;
        }
        else if (dir == '^') {

            currPos[1] += 1;
        }
        else {
            currPos[1] -= 1;
        }

        houses.add(currPos[0] + ',' + currPos[1]);
    }

    console.log("OUTPUT >> " + houses.size);
});