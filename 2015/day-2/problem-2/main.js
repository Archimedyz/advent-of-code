const fs = require('fs');

fs.readFile(__dirname + '/input.txt', 'utf8' , (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    var rows = data.split('\n');

    var totalFt = 0;

    for (var i = 0; i < rows.length; ++i)
    {
        // dimensions
        var dim = rows[i].split('x');

        /* Since we are working with strings, dim[j] are also all strings.
         * If we compare the strings '27' and '5', we find that '5' is "bigger".
         * We want to do numerical comparisons, so we force the type to `int`
         * by multiplying the dimensions upfront by 1.
         */

        var smallestLength1 = 1 * dim[0];
        var smallestLength2 = 1 * dim[1];
        var thirdDim = 1 * dim[2];

        if (smallestLength1 < smallestLength2) {
            if(smallestLength2 > thirdDim)
            {
                smallestLength2 = thirdDim;
            }
        }
        else if (smallestLength1 > thirdDim)
        {
            smallestLength1 = thirdDim;
        }

        volume = dim[0] * dim[1] * dim[2];
        totalFt += 2 * (smallestLength1 + smallestLength2) + volume;
    }

    console.log("OUTPUT >> " + totalFt);
});