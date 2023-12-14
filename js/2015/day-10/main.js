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

let res1 = input;
for (let i = 0; i < 40; ++i) {
    res1 = lookAndSay(res1);
}

let res2 = res1;
for (let i = 0; i < 10; ++i) { // 10 more iteraions on res1 == 50 iterations on input
    res2 = lookAndSay(res2);
}

console.log("OUTPUT 1 >> " + res1.length);
console.log("OUTPUT 2 >> " + res2.length);