var input = "1113222113";
let iterations = 50;

function lookAndSay(str) {
    let result = "";

    let i = 0;
    let len = str.length;

    while (i < len) {
        digit = str[i];
        count = 1;

        while (i+1 < len && digit == str[i+1]) {
            ++count;
            ++i;
        }

        result += count.toString() + digit.toString();

        ++i;
    }

    return result;
}

let res = input;
for (let i = 0; i < iterations; ++i) {
    res = lookAndSay(res);
}

console.log("OUTPUT >> " + res.length);