const fs = require('fs');
const { exit } = require('process');
const { stringify } = require('querystring');

function sumAllNumbers(obj, ignoreRed) {
    switch (typeof obj) {
        case 'number': return parseInt(obj);
        case 'string': return 0;
        case 'object':
            let isArray = Array.isArray(obj);
            let sum = 0;
            for (let key in obj) {
                if (!isArray && ignoreRed && obj[key] == 'red') {
                    return 0;
                }

                sum += sumAllNumbers(obj[key], ignoreRed);
            }
            return sum;
        default: 
            console.error("Unhandled type: '" + (typeof obj) + "'");
            exit(1);
    }
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    
    let obj = JSON.parse(data);

    let res1 = sumAllNumbers(obj, false);
    let res2 = sumAllNumbers(obj, true);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 1 >> " + res2);
});
