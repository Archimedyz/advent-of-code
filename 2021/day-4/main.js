const fs = require('fs');
const { exit } = require('process');

var nums = [];
var boards = [];
var wonBoards = [];

function parseNums(str) {
    let parts = str.split(',');
    for (let i in parts) {
        nums.push(parts[i]);
    }
}

function parseBoard(rows) {
    if (rows.length != 5) {
        console.error("Board is not 5x5!");
        exit(1);
    }

    boardArray = [];
    boardMap = {};

    for (let i in rows) {
        let row = rows[i].match(/\d+/g);
        for (let j in row) {
            let val = row[j];
            boardArray.push({val: val, marked: false});
            boardMap[val] = {
                i: parseInt(i),
                j: parseInt(j)
            };
        }
    }

    boards.push({
        arr: boardArray,
        map: boardMap,
        hasWon: false,
        winningNum: null
    });
}

function parseInput(rows) {
    // parse drawn numbers
    parseNums(rows[0]);

    let i = 1;
    while (i < rows.length) {
        // skip the empty line
        ++i;

        // parse the board
        let boardRows = rows.slice(i, i+5);
        parseBoard(boardRows);

        i += 5;
    }
}

function markBoard(board, n) {
    let pos = board.map[n];

    if (!pos) {
        return false;
    }

    // mark the postion
    let i = pos.i;
    let j = pos.j;
    board.arr[(5 * i) + j].marked = true;

    // check for the win:
    let markedRow = 0;
    let markedCol = 0;
    for (let k = 0; k < 5; ++k) {
        if (board.arr[(5 * i) + k].marked) {
            ++markedRow;
        }

        if (board.arr[(5 * k) + j].marked) {
            ++markedCol;
        }
    }

    if (markedRow == 5 || markedCol == 5) {
        board.hasWon = true;
        board.winningNum = parseInt(n);
        wonBoards.push(board);
    }
}

function play() {
    for (let k in nums) {
        let n = nums[k];

        for (let h in boards) {
            let board = boards[h];

            if (board.hasWon) {
                continue;
            }

            markBoard(board, n);
        }

        if (boards.length == wonBoards.length) {
            break;
        }
    }
}

function calculateScore(board) {
    let score = 0;

    let arr = board.arr;
    for (let i in arr) {
        let item = arr[i];
        if (!item.marked) {
            score += parseInt(item.val);
        }
    }

    return score * board.winningNum;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    
    let rows = data.split('\r\n');

    parseInput(rows);

    play();

    // first won board
    let res1 = calculateScore(wonBoards[0]);

    // last won board
    let res2 = calculateScore(wonBoards[wonBoards.length-1]);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});