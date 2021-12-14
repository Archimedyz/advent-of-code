const fs = require('fs');

function print(sheet) {
    let finalStr = "";
    for (let y = 0; y < sheet.size.height; ++y) {
        let str = "";
        for (let x = 0; x < sheet.size.width; ++x) {
            str += sheet.grid[sheet.size.width * y + x] ? '#' : ' ';
        }
        finalStr += str + '\n';
    }

    console.log(finalStr);
}

function parseInput(data) {
    let grid = [];
    let instructions = [];
    let size = {width: 0, height: 0};

    let lines = data.split("\r\n");

    let i = 0;

    let points = [];

    // first build up the list of points, and determine the size
    while (lines[i] != '') {
        let parts = lines[i].split(',');

        let point = {
            x: parseInt(parts[0]),
            y: parseInt(parts[1])
        }

        if (size.width < point.x) {
            size.width = point.x;
        }
        
        if (size.height < point.y) {
            size.height = point.y;
        }

        points.push(point);

        ++i;
    }

    /* 
     * if we're here, we've reached the end of the coordinates
     * next up are the instructions.
     */

    // the size was 0-based. increment both wight and height
    // by 1 to make it 1-based.
    ++size.width;
    ++size.height;
    
    // Increment i once more to skip the empty line.
    ++i;

    while (i < lines.length) {
        let parts = lines[i].split(' ')[2].split('=');
        
        instructions.push({
            line: parts[0],
            val: parseInt(parts[1])
        });

        ++i;
    }

    // finally, populate the grid using the size and coordiantes.
    for (let k in points) {
        let p = points[k];

        grid[size.width * p.y + p.x] = true;
    }
    

    return {
        grid: grid, 
        instructions, instructions,
        size: size
    };
}

function makeFold(originalGrid, originalSize, instruction) {
    let grid = [];
    let size = {...originalSize};

    let val = instruction.val;

    if (instruction.line == 'y') { // horizontal fold
        // adjust the size:
        size.height = val;

        // copy the old sheet values
        for (let x = 0; x < size.width; ++x) {
            for (let y = 0; y < size.height; ++y) {
                grid[size.width * y + x] = originalGrid[originalSize.width * y + x]
            }
        }

        // now transpose the folded points onto the new sheet
        for (let x = 0; x < size.width; ++x) {
            for (let y = val + 1; y < originalSize.height; ++y) {
                let originalVal = originalGrid[originalSize.width * y + x];
                
                if (!originalVal) {
                    continue;
                }

                let newY = val - (y - val);
                grid[size.width * newY + x] = originalVal;
            }
        }
    }
    else { // vertical fold
        // adjust the size:
        size.width = val;

        // copy the old sheet values
        for (let x = 0; x < size.width; ++x) {
            for (let y = 0; y < size.height; ++y) {
                grid[size.width * y + x] = originalGrid[originalSize.width * y + x]
            }
        }

        // now transpose the folded points onto the new sheet
        for (let x = val + 1; x < originalSize.width; ++x) {
            for (let y = 0; y < size.height; ++y) {
                let originalVal = originalGrid[originalSize.width * y + x];
                
                if (!originalVal) {
                    continue;
                }

                let newX = val - (x - val);
                grid[size.width * y + newX] = originalVal;
            }
        }
    }

    return {
        grid: grid,
        size: size
    };
}

function foldSheet(originalSheet) {
    let grid = [...originalSheet.grid];
    let size = {...originalSheet.size};

    for (let i in originalSheet.instructions) {
        let instruction = originalSheet.instructions[i];

        let res = makeFold(grid, size, instruction);
        grid = res.grid;
        size = res.size;
    }

    return {
        grid: grid,
        instructions: [],
        size: size
    };
}

function countDots(originalSheet) {
    let sheet = foldSheet(originalSheet);

    let count = 0;

    for (let k in sheet.grid) {
        if (sheet.grid[k]) {
            ++count;
        }
    }

    return count;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let sheet = parseInput(data);

    let sheet1 = {...sheet};
    sheet1.instructions = [sheet.instructions[0]];

    let res1 = countDots(sheet1);
    let res2 = foldSheet(sheet);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >>");
    print(res2);
});
