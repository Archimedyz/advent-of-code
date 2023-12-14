const fs = require('fs');

function computeLengths(str) {
    // memory length is 0
    let memoryLength = 0;
    // start at 2 to include the start and end quotes
    let codeLength = 2;
    // we can start the encoded length at 6, since we
    // know the start has two double quotes which need
    // to be escaped.
    let encodedLength = 6;

    for (let i = 0; i < str.length; ++i) {
        let c = str[i];

        // we can increment the memory length since each
        // iteration from the top of this loop is for a character
        // in memory.
        memoryLength += 1;

        if (c != '\\') {
            codeLength += 1;
            encodedLength += 1;
            continue;
        }

        // the character is `\`, so we should look ahead and
        // determine what to do. Also increment `i` as we will
        // not need to come back to this character
        let c1 = str[++i];

        // escaping a single quote or backslash
        if (c1 == '"' || c1 == '\\') {
            codeLength += 2;
            encodedLength += 4;
            continue;
        }

        // escaping an ASCII character
        // the next two characters can be skipped
        i += 2;
        codeLength += 4;
        encodedLength += 5; // only escape the first backslash
    }

    return {
        memoryLength: memoryLength,
        codeLength: codeLength,
        encodedLength: encodedLength
    };
}

fs.readFile(__dirname + '/input.txt', 'utf8', (err, data) => {
    
    if (err) {
        console.log(err);
        return;
    }
    
    let rows = data.split('\r\n');

    let res1 = 0, res2 = 0;
    for (let i = 0; i < rows.length; ++i) {
        cl = computeLengths(rows[i]);
        res1 += cl.codeLength - cl.memoryLength;
        res2 += cl.encodedLength - cl.codeLength;
    }

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});

