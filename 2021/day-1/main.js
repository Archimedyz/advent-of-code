const fs = require('fs');

fs.readFile(__dirname + '/input.txt', 'utf8', (err, data) => {
    
    if (err) {
        console.log(err);
        return;
    }
    
    let rows = data.split('\r\n');

    let res1 = 0, res2 = 0;

    for (let i = 0; i + 1 < rows.length; ++i) {
        let a = parseInt(rows[i]);
        let b = parseInt(rows[i+1]);

        if (a < b) {
            ++res1;
        }

        if (i + 3 >= rows.length) {
            continue;
        }

        let c = parseInt(rows[i+2]);
        let d = parseInt(rows[i+3]);

        if (a + b + c < b + c + d) {
            ++res2;
        }
    }
    
    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});
