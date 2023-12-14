const fs = require('fs');

var input = '';

fs.readFile(__dirname + '/input.txt', 'utf8' , (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    var floor = 0;

    for (var i = 0; i < data.length; ++i)
    {
        char = data[i];
        floor += char == '(' ? 1 : -1;

        if (floor < 0)
        {
            console.log("OUTPUT >> " + (1 + i));
            return;
        }
    }

    console.log("OUTPUT >> <never goes below 0>");
})