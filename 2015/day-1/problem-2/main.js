const fs = require('fs');

var input = '';

fs.readFile(__dirname + '/input.txt', 'utf8' , (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    input = data;

    var floor = 0;

    for (var i = 0; i < input.length; ++i)
    {
        char = input[i];
        floor += char == '(' ? 1 : -1;

        if (floor < 0)
        {
            console.log("OUTPUT >> " + (1 + i));
            return;
        }
    }

    console.log("OUTPUT >> <never goes below 0>");
})