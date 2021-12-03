const fs = require('fs');

function getBitCounts(lst) {
    let zeros = [], ones = [];

    for (let i = 0; i < lst.length; ++i) {
        let str = lst[i];

        for (let j = 0; j < str.length; ++j) {
            if (i == 0) { // use the first row to initialize the counts to 0
                zeros[j] = 0;
                ones[j] = 0;
            }

            if (str[j] == '0') {
                ++zeros[j];
            }
            else {
                ++ones[j];
            }
        }
    }

    return {
        zeros: zeros,
        ones, ones
    }
}

function filterBitList(lst, index, val) {
    let res = [];

    for (let i = 0; i < lst.length; ++i) {
        let item = lst[i];

        if (item[index] == val) {
            res.push(item);
        }
    }

    return res;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    
    let rows = data.split('\r\n');
    
    let bitCounts = getBitCounts(rows);

    let gamma_b2 = '', epsilon_b2 = '';
    for (let i = 0; i < bitCounts.zeros.length; ++i) {
        if (bitCounts.zeros[i] > bitCounts.ones[i]) {
            gamma_b2 += '0';
            epsilon_b2 += '1';
        }
        else {
            gamma_b2 += '1';
            epsilon_b2 += '0';
        }
    }

    let gamma_b10 = parseInt(gamma_b2, 2);
    let epsilon_b10 = parseInt(epsilon_b2, 2);

    let res1 = gamma_b10 * epsilon_b10;

    let oLst = rows;
    let cLst = rows;

    let oBitCounts = bitCounts;
    let cBitCounts = bitCounts;

    for (let i = 0; i < gamma_b2.length; ++i) {
        if (oLst.length > 1) {
            oLst = filterBitList(oLst, i, oBitCounts.zeros[i] > oBitCounts.ones[i] ? 0 : 1);
            oBitCounts = getBitCounts(oLst);
        }

        if (cLst.length > 1) {
            cLst = filterBitList(cLst, i, cBitCounts.zeros[i] <= cBitCounts.ones[i] ? 0 : 1);
            cBitCounts = getBitCounts(cLst);
        }
    }

    let oRating = parseInt(oLst[0], 2);
    let cRating = parseInt(cLst[0], 2);

    let res2 = oRating * cRating;

    console.log('OUTPUT 1 >> ' + res1);
    console.log('OUTPUT 2 >> ' + res2);
});