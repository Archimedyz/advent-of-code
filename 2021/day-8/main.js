const fs = require('fs');

function normalizeDigits(arr) {
    for (let i = 0; i < arr.length; ++i) {
        arr[i] = [...arr[i]].sort().join('');
    }
    return arr;
}

function parseInput(rows) {
    let arr = [];

    for (let i in rows) {
        let parts = rows[i].split(' | ');
        arr.push({
            digits: normalizeDigits(parts[0].split(' ')),
            outputs: normalizeDigits(parts[1].split(' '))
        });
    }

    return arr;
}

function findDigit1478Counts(displays) {
    let count = 0;

    for (let i in displays) {
        let display = displays[i];

        for (let j in display.outputs) {
            let digit = display.outputs[j];

            switch (digit.length) {
                case 2: // one
                case 3: // seven
                case 4: // four
                case 7: // eight
                    ++count;
                    break;
                default:
                    break;
            }
        }
    }

    return count;
}

function diff(sml, big) {
    let res = '';
    for (let k in big) {
        if (!sml.includes(big[k])) {
            res += big[k];
        }
    }
    return res;
}

function isSubset(sup, sub) {
    for (let k in sub) {
        if (!sup.includes(sub[k])) {
            return false;
        }
    }

    return true;
}

function getMappings(arr) {
    let nums = [null, null, null, null, null, null, null, null, null, null];
    let map = {};

    let foundDigits = 0;

    let diffOneFour = null;

    while (foundDigits < 10) {
        for (let i in arr) {
            let digit = arr[i];

            if (map[digit]) {
                continue;
            }

            switch (digit.length) {
                case 2: // one
                    nums[1] = digit;
                    map[digit] = '1';
                    ++foundDigits;
                    break;
                case 3: // seven
                    nums[7] = digit;
                    map[digit] = '7';
                    ++foundDigits;
                    break;
                case 4: // four
                    nums[4] = digit;
                    map[digit] = '4';
                    ++foundDigits;
                    break;
                case 5: // two, three, five
                    if (nums[3] == null && nums[1] != null && isSubset(digit, nums[1])) { // three
                        nums[3] = digit;
                        map[digit] = '3';
                        ++foundDigits;
                    } else if (nums[5] == null && diffOneFour != null && isSubset(digit, diffOneFour)) { // five
                        nums[5] = digit;
                        map[digit] = '5';
                        ++foundDigits;
                    } else if (nums[2] == null && nums[1] != null && nums[4] != null) { // two
                        nums[2] = digit;
                        map[digit] = '2';
                        ++foundDigits;
                    }
                    break;
                case 6: // zero, six, nine
                    if (nums[6] == null && nums[1] != null && !isSubset(digit, nums[1])) { // six
                        nums[6] = digit;
                        map[digit] = '6';
                        ++foundDigits;
                    } else if (nums[9] == null && diffOneFour != null && isSubset(digit, diffOneFour)) { // nine
                        nums[9] = digit;
                        map[digit] = '9';
                        ++foundDigits;
                    } else if (nums[0] == null && nums[1] != null && nums[4] != null) { // zero
                        nums[0] = digit;
                        map[digit] = '0';
                        ++foundDigits;
                    }
                    break;
                case 7: // eight
                    nums[8] = digit;
                    map[digit] = '8';
                    ++foundDigits;
                    break;
                default:
                    break;
            }
            
            if (diffOneFour == null && nums[1] != null && nums[4] != null) {
                diffOneFour = diff(nums[1], nums[4])
            }
            
            if (foundDigits >= 10) break;
        }
    }

    return map;
}

function findSum(displays) {
    let sum = 0;

    for (let i in displays) {
        let display = displays[i];

        let map = getMappings(display.digits);

        let str = '';

        for (let j in display.outputs) {
            let digit = display.outputs[j];
            str += map[digit];
        }

        let val = parseInt(str);

        sum += val;
    }

    return sum;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let rows = data.split('\r\n');

    let displays = parseInput(rows);

    let res1 = findDigit1478Counts(displays);
    let res2 = findSum(displays);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});