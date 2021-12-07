const fs = require('fs');

function simLanternFish(original, totalDays) {
    let arr = [...original];

    for (let day = 0; day < totalDays; ++day) {
        let newArr = [0,0,0,0,0,0,0,0,0];

        for (let i = 0; i < arr.length; ++i) {
            let val = arr[i];
            let newI = i - 1;
            
            if (newI < 0) {
                newArr[newArr.length - 1] = val;
                newI = 6;
            }

            newArr[newI] += val;
        }

        arr = newArr;
    }

    let count = 0;
    for (let key in arr) {
        count += arr[key];
    }

    return count;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let strs = data.split(',');

    let pool = [0,0,0,0,0,0,0,0,0];
    
    for (let key in strs) {
        let val = parseInt(strs[key]);
        ++pool[val];
    }

    let res1 = simLanternFish(pool, 80);
    let res2 = simLanternFish(pool, 256);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});