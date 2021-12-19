const fs = require('fs');
const { exit } = require('process');

function parseInput(data) {
    let bits = '';

    for (let i in data) {
        switch(data[i]) {
            case '0': bits += '0000'; break;
            case '1': bits += '0001'; break;
            case '2': bits += '0010'; break;
            case '3': bits += '0011'; break;
            case '4': bits += '0100'; break;
            case '5': bits += '0101'; break;
            case '6': bits += '0110'; break;
            case '7': bits += '0111'; break;
            case '8': bits += '1000'; break;
            case '9': bits += '1001'; break;
            case 'A': bits += '1010'; break;
            case 'B': bits += '1011'; break;
            case 'C': bits += '1100'; break;
            case 'D': bits += '1101'; break;
            case 'E': bits += '1110'; break;
            case 'F': bits += '1111'; break;
        }
    }

    return bits;
}

function getVal(bits) {
    return parseInt(bits, 2);
}

function parseListeral(bits, index) {
    let valBits = 0;
    let len = 0;

    let i = 0;
    for (i = index; bits[i] != 0; i += 5) {
        len += 5;
        valBits += bits.substring(i + 1, i + 5);
    }

    // the final 5-bit group is not procesed above
    // do it maunually    
    len += 5;
    valBits += bits.substring(i + 1, i + 5);

    let val = getVal(valBits);

    return {val: val, len: len};
}

function parsePacket(bits, index) {
    let versionBits = bits.substring(index, index + 3);
    let typeBits = bits.substring(index + 3, index + 6);

    let packet = {
        version: getVal(versionBits),
        type: getVal(typeBits),
        len: null,
        subPackets: null,
        value: null
    }

    // literal value packet
    if (packet.type == 4) {
        let res =  parseListeral(bits, index + 6);
        packet.value = res.val;
        packet.len = 6 + res.len;
        return packet;
    }

    // operator packet
    let lengthType = bits[index + 6];
    
    if (lengthType == '0') { // length type 0
        let lengthBits = bits.substring(index + 7, index + 22);

        let len = getVal(lengthBits);
        
        packet.len = 22 + len;
        packet.subPackets = [];

        let i = 0;
        do {
            let subPacket = parsePacket(bits, index + 22 + i);
            
            packet.subPackets.push(subPacket);

            i += subPacket.len;
        } while (i < len);
    }
    else { //length type 1
        let countBits = bits.substring(index + 7, index + 18);

        let count = getVal(countBits);
        
        packet.subPackets = [];

        packet.len = 18;

        for (let n = 0, i = 0; n < count; ++n) {
            let subPacket = parsePacket(bits, index + 18 + i);

            packet.subPackets.push(subPacket);
            packet.len += subPacket.len;

            i += subPacket.len;
        }
    }

    return packet;
}

function sumVersions(packet) {
    if (packet.subPackets == null) {
        return packet.version;
    }

    let sum = packet.version;

    for (let k in packet.subPackets) {
        sum += sumVersions(packet.subPackets[k]);
    }

    return sum;
}

function evaluate(packet) {
    let op = null;
    switch (packet.type) {
        case 0: // sum
            op = (a, b) => a + b;
            break;
        case 1: // product 
            op = (a, b) => a * b;
            break;
        case 2: // min 
            op = (a, b) => a < b ? a : b;
            break;
        case 3: // max 
            op = (a, b) => a > b ? a : b;
            break;
        case 4: // literal value
            return packet.value;
        case 5: // great than 
            op = (a, b) => a > b ? 1 : 0;
            break;
        case 6: // less than 
            op = (a, b) => a < b ? 1 : 0;
            break;
        case 7: // equals 
            op = (a, b) => a == b ? 1 : 0;
            break;
        default:
            console.error('Unknown packet type: ' + packet.type + '. Aborting.');
            exit(1);
    }

    let res = evaluate(packet.subPackets[0]);

    if (packet.subPackets.length == 1) {
        return res;
    }

    for (let i = 1; i < packet.subPackets.length; ++i) {
        let eval = evaluate(packet.subPackets[i]);

        res = op(res, eval);
    }

    return res;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let bits = parseInput(data);

    let packet = parsePacket(bits, 0);

    let res1 = sumVersions(packet);
    let res2 = evaluate(packet);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});
