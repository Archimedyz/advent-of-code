/* NOTE
 * For this challenge, instead of modifying the code,
 * I simply modified the input.txt file by hand.
 *  That as enough to obtain the solution.
 */
const fs = require('fs');

var wires = {};

function NOT(val) {
    return (~val) & 0xFFFF;
}

function OR(left, right) {
    return (left | right) & 0xFFFF;
}

function AND(left, right) {
    return left & right & 0xFFFF;
}

function RSHIFT(left, right) {
    return (left >> right) & 0xFFFF;
}

function LSHIFT(left, right) {
    return (left << right) & 0xFFFF;
}

function getInput(operand) {
    if (operand.isNum) {
        return operand.val;
    }

    let wireValue = wires[operand.id];

    return wireValue == null || isNaN(wireValue) ? -1 : wireValue;
}

function processComponent(comp) {
    if (comp.processed) {
        console.warn('Trying to process an already precessed component. Skipping...');
        return false;
    }

    let rightInput = getInput(comp.right);

    if (rightInput < 0) {
        return false;
    }

    // no-op means plain assignment
    if (comp.op == null) {
        wires[comp.out] = rightInput;
        comp.processed = true;
        return true;
    }

    // NOT only requires 1 operand
    if (comp.op == 'NOT') {
        wires[comp.out] = NOT(rightInput);
        comp.processed = true;
        return true;
    }

    // all other operations require a `left` input.
    let leftInput = getInput(comp.left);

    if (leftInput < 0) {
        return false;
    }

    let opFunc = null;
    switch(comp.op) {
        case 'OR': opFunc = OR; break;
        case 'AND': opFunc = AND; break;
        case 'LSHIFT': opFunc = LSHIFT; break;
        case 'RSHIFT': opFunc = RSHIFT; break;
        default: console.error('Trying to process unknown operator (' + comp.op + ').'); return false;
    }

    wires[comp.out] = opFunc(leftInput, rightInput);
    comp.processed = true;
    return true;
}

function processOperand(str) {
    if (str == null) {
        return null;
    }

    let isNum = !isNaN(str);
    let val = isNum ? parseInt(str) : str;
   
    return {
        id: str,
        val: val,
        isNum: isNum
    };
}

function parseComponent(str) {
    let sides = str.split(' -> ');
    let out = sides[1];

    let parts = sides[0].split(' ');

    let op = null;
    let lval = null; // left value
    let rval = null; // right value

    if (parts.length == 1) {
        // 1 part means we have an assignment
        rval = parts[0];
    }
    else if (parts.length == 2) {
        // 2 parts means we have a unary operation
        op = parts[0];
        rval = parts[1];
    }
    else {
        // otherwise we probably have 3 parts for a binary operation
        lval = parts[0];
        op = parts[1];
        rval = parts[2];
    }

    left = processOperand(lval);
    right = processOperand(rval);
    
    // add the output variable to the collection `wires` for later use
    wires[out] = null;

    return {
        op: op,
        left: left,
        right: right,
        processed: false,
        out: out,
        line: str
    };
}

fs.readFile(__dirname + '/input.txt', 'utf8', (err, data) => {
    
    if (err) {
        console.log(err);
        return;
    }
    
    let rows = data.split('\r\n');

    let comps = [];

    for (let i = 0; i < rows.length; ++i) {
        comps.push(parseComponent(rows[i]));
    }
    
    var totalProcessedComps = 0;
    while (totalProcessedComps < comps.length)
    {
        let processedComps = 0;
        for (let i = 0; i < comps.length; ++i)
        {
            let comp = comps[i];

            if (comp.processed) {
                continue;
            }

            let wasProcessed = processComponent(comp);

            if (wasProcessed) {
                ++processedComps;
            }
        }

        if (processedComps == 0) {
            console.error("Had an iteration where no components were processed! Total components processed: " + totalProcessedComps);
            return;
        }

        totalProcessedComps += processedComps;
    }

    console.log("OUTPUT >> " + wires['a']);
});

