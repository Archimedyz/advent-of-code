const md5 = require('md5');

var zeroCount = 6;
var prefix = '0'.repeat(zeroCount);
var input = "iwrupvqb";

var limit = 10000000;


for (var i = 1; i < limit; ++i)
{
    var hash = md5(input + i);
    if (hash.startsWith(prefix)) {
        console.log('OUTPUT >> ' + i);
        return;
    }
}

console.error('ERROR >> Did not find valid hash within limit ' + limit);
