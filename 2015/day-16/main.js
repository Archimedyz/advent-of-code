const fs = require('fs');

function parseInput(data) {
    let obj = {};

    let lines = data.split('\r\n');
    for (let i in lines) {
        let parts = lines[i].split(/\:\s(.+)/g);
        
        let id = parseInt(parts[0].split(' ')[1]);
        let details = {};

        let dParts = parts[1].split(', ');
        for (let k in dParts) {
            let d = dParts[k].split(': ');

            details[d[0]] = parseInt(d[1]);
        }

        obj[id] = details;
    }

    return obj;
}

function findAunts(obj, conditions) {
    let res = {};

    for (let k in obj) {
        let aunt = obj[k];

        let include = true;
        for (let detail in aunt) {
            if (aunt[detail] != conditions[detail]) {
                include = false;
                break;
            }
        }

        if (include == true) {
            res[k] = aunt;
        }
    }

    return res;
}

function findAunts2(obj, conditions) {
    let res = {};

    for (let k in obj) {
        let aunt = obj[k];

        let include = true;
        for (let detail in aunt) {
            switch (detail) {
                case 'cats':
                case 'trees':
                    if (aunt[detail] <= conditions[detail]) {
                        include = false;
                    }
                    break;
                case 'pomeranians':
                case 'goldfish':
                    if (aunt[detail] >= conditions[detail]) {
                        include = false;
                    }
                    break;
                default:
                    if (aunt[detail] != conditions[detail]) {
                        include = false;
                    }
                    break;
            }

            if (include == false) {
                break;
            }
        }

        if (include == true) {
            res[k] = aunt;
        }
    }

    return res;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let obj = parseInput(data);

    let conditions = {
        children: 3,
        cats: 7,
        samoyeds: 2,
        pomeranians: 3,
        akitas: 0,
        vizslas: 0,
        goldfish: 5,
        trees: 3,
        cars: 2,
        perfumes: 1
    };
    
    let res1 = findAunts(obj, conditions);
    let res2 = findAunts2(obj, conditions);

    console.log("OUTPUT 1 >> " + JSON.stringify(res1));
    console.log("OUTPUT 2 >> " + JSON.stringify(res2));
});
