var input = 'hepxcrrq';

var alphabet = {a: {id: 'a', next: null}};
alphabet.z = {id: 'z', next: alphabet.a};
alphabet.y = {id: 'y', next: alphabet.z};
alphabet.x = {id: 'x', next: alphabet.y};
alphabet.w = {id: 'w', next: alphabet.x};
alphabet.v = {id: 'v', next: alphabet.w};
alphabet.u = {id: 'u', next: alphabet.v};
alphabet.t = {id: 't', next: alphabet.u};
alphabet.s = {id: 's', next: alphabet.t};
alphabet.r = {id: 'r', next: alphabet.s};
alphabet.q = {id: 'q', next: alphabet.r};
alphabet.p = {id: 'p', next: alphabet.q};
alphabet.n = {id: 'n', next: alphabet.p};
alphabet.m = {id: 'm', next: alphabet.n};
alphabet.k = {id: 'k', next: alphabet.m};
alphabet.j = {id: 'j', next: alphabet.k};
alphabet.h = {id: 'h', next: alphabet.j};
alphabet.g = {id: 'g', next: alphabet.h};
alphabet.f = {id: 'f', next: alphabet.g};
alphabet.e = {id: 'e', next: alphabet.f};
alphabet.d = {id: 'd', next: alphabet.e};
alphabet.c = {id: 'c', next: alphabet.d};
alphabet.b = {id: 'b', next: alphabet.c};
alphabet.a.next = alphabet.b;

let straights = new Set([
    'abc', 'bcd', 'cde',
    'def', 'efg', 'fgh',
    'pqr', 'qrs', 'rst',
    'stu', 'tuv', 'uvw',
    'vwx', 'wxy', 'xyz',
]);

function inc(str) {
    let i = str.length - 1;

    while (i >= 0) {
        let char = str[i];
        let nextChar = alphabet[char].next.id;

        str[i] = nextChar;

        if (nextChar != 'a') {
            break;
        }

        --i;
    }

    return str;
}

function isValid(str) {
    let containsStraight = false;
    let doubles = new Set();
    for (let i = 0; i < str.length - 1; ++i) {
        let next3 = i + 2 >= str.length
            ? null
            : str[i] + str[i + 1] + str[i + 2];

        if (straights.has(next3)) {
            containsStraight = true;
        }

        let first = str[i];
        let second = str[i + 1];

        if (first == second) {
            doubles.add(first);
        }
    }
    
    return containsStraight && (doubles.size >= 2);
}

function findNextPassword(str) {

    let strLst = [];
    for (let i = 0; i < str.length; ++i) {
        strLst.push(str[i]);
    }

    inc(strLst);

    while (!isValid(strLst)) {
        inc(strLst);
    }

    let res = strLst.join('');

    return res;
}

let res1 = findNextPassword(input);
let res2 = findNextPassword(res1);

console.log("OUTPUT 1 >> " + res1);
console.log("OUTPUT 2 >> " + res2);
