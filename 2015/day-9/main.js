const fs = require('fs');

var graph = {};
var aNode = null;
var loops = [];

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
    let parts = str.split(' = ');

    let dist = parseInt(parts[1]);

    let nodeIds = parts[0].split(' to ');

    let start = getNode(nodeIds[0]);
    let end = getNode(nodeIds[1]);

    if (aNode == null) {
        aNode = start;
    }

    // undirected graph; add the edge to both nodes
    start.n[end.id] = {
        node: end,
        dist: dist
    };

    end.n[start.id] = {
        node: start,
        dist: dist
    };
}

function computeDist(ring, findMin) {
    let minDist = null;
    let maxDist = null;
    let ringDist = 0;
    let rLength = ring.length;

    if (rLength == 1) {
        return 0;
    }

    for (let i = 0; i < rLength - 1; ++i) {
        let curr = ring[i];
        let next = ring[i+1];

        let dist = graph[curr].n[next].dist;

        ringDist += dist;

        if (minDist == null || minDist > dist) {
            minDist = dist;
        }

        if (maxDist == null || maxDist < dist) {
            maxDist = dist;
        }
    }

    // finally, we should consider the distance
    // from the last node back to the first to
    // complete the ring
    let curr = ring[rLength - 1];
    let next = ring[0];

    let dist = graph[curr].n[next].dist;

    ringDist += dist;

    if (minDist == null || minDist > dist) {
        minDist = dist;
    }

    if (maxDist == null || maxDist < dist) {
        maxDist = dist;
    }

    return  ringDist - (findMin ? maxDist : minDist);
}

function getRingDist(ring, findMin) {
    let optimalDist = null;

    for (let key in graph) {
        if (ring.includes(key)) {
            continue;
        }

        ring.push(key);
        let dist = getRingDist(ring, findMin);
        ring.pop();

        if (optimalDist == null || 
            (findMin && optimalDist > dist) ||
            (!findMin && optimalDist < dist)) {
            optimalDist = dist
        }
    }

    if (optimalDist == null) {
        optimalDist = computeDist(ring, findMin);
    }

    return optimalDist;
}

function getDist(findMin) {
    let ring = [aNode.id];

    return getRingDist(ring, findMin);
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
    
    console.log("OUTPUT 1 >> " + getDist(true));
    console.log("OUTPUT 2 >> " + getDist(false));
});
