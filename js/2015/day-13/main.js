const fs = require('fs');
const { exit } = require('process');

var graph = {};
var firstNode = null;

function getNode(id) {
    if (!graph[id]) {
        // if no node with this key exists, then
        // add it to the graph.
        graph[id] = {
            id: id,
            n: {}
        }
    }

    return graph[id];
}

function parseEdge(str) {
    let split1 = str.split(" happiness units by sitting next to ");
    let target = split1[1].substring(0, split1[1].length - 1); // remove '.'

    let split2 = split1[0].split(" would ");
    let source = split2[0];

    let split3 = split2[1].split(" ");

    let magnitude = parseInt(split3[1]);
    if (split3[0] == 'lose') {
        magnitude = -magnitude;
    }

    let sNode = getNode(source);
    let tNode = getNode(target);

    sNode.n[target] = {
        node: tNode,
        happiness: magnitude
    };

    if (!firstNode) {
        firstNode = sNode;
    }
}

function computeHappiness(ring) {
    let happiness = 0;
    let rLength = ring.length;

    for (let i = 0; i < rLength; ++i) {
        let lKey = ring[i];
        let j = (i + 1) % rLength; 
        let rKey = ring[j];

        let lNode = getNode(lKey);
        let rNode = getNode(rKey);

        let lHappiness = lNode.n[rKey].happiness;
        let rHappiness = rNode.n[lKey].happiness;

        happiness += lHappiness + rHappiness;
    }

    return  happiness;
}

function getOptimalHappiness(ring) {
    let optimalHappiness = null;

    for (let key in graph) {
        if (ring.includes(key)) {
            continue;
        }

        ring.push(key);
        let h = getOptimalHappiness(ring);
        ring.pop();

        if (optimalHappiness == null || optimalHappiness < h) {
            optimalHappiness = h
        }
    }

    if (optimalHappiness == null) {
        optimalHappiness = computeHappiness(ring);
    }

    return optimalHappiness;
}

function findOptimalHappiness() {
    let ring = [firstNode.id];
    return getOptimalHappiness(ring);
}

fs.readFile(__dirname + '/input.txt', 'utf8', (err, data) => {
    
    if (err) {
        console.log(err);
        return;
    }
    
    let rows = data.split('\r\n');

    for (let i = 0; i < rows.length; ++i) {
        parseEdge(rows[i]);
    }

    let res1 = findOptimalHappiness();

    let me = getNode('me');
    for (let k in graph) {
        let node = graph[k];

        me.n[k] = {
            node: node,
            happiness: 0
        };

        node.n[me.id] = {
            node: me,
            happiness: 0
        };
    }
    
    let res2 = findOptimalHappiness();

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});
