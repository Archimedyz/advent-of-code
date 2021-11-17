const fs = require('fs');

function stringDiff(str) {
    // start at 2 to include the start and end quotes
    let codeLength = 2;
    let memLength = 0;

    for (let i = 0; i < str.length; ++i) {
        let c = str[i];

        // we can increment the memory length since each
        // iteration from the top of this loop is for a character
        // in memory.
        memLength += 1;

        if (c != '\\') {
            codeLength += 1;
            continue;
        }

        // the character is `\`, so we should look ahead and
        // determine what to do. Also increment `i` as we will
        // not need to come back to this character
        let c1 = str[++i];

        // escaping a single quote or backslash
        if (c1 == '"' || c1 == '\\') {
            codeLength += 2;
            continue;
        }

        // escaping an ASCII character
        // the next two characters can be skipped
        i += 2;
        codeLength += 4;
    }

    return codeLength - memLength;
}

fs.readFile(__dirname + '/input.txt', 'utf8', (err, data) => {
    
    if (err) {
        console.log(err);
        return;
    }
    
    let rows = data.split('\r\n');

    let diff = 0;
    for (let i = 0; i < rows.length; ++i) {
        diff += stringDiff(rows[i]);
    }

    console.log("OUTPUT >> " + diff);
});

