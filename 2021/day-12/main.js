const fs = require('fs');

function getNode(graph, key) {
    if (!graph[key]) {
        graph[key] = {
            key: key,
            isSmall: key.toLowerCase() == key,
            neighbors: []
        }
    }
    
    return graph[key];
}

function parseInput(data) {
    let graph = {};

    let lines = data.split("\r\n");

    for (let i in lines) {

        parts = lines[i].split('-');
        
        let a = getNode(graph, parts[0]);
        let b = getNode(graph, parts[1]);

        a.neighbors.push(b);
        b.neighbors.push(a);
    }

    return graph;
}


function findAllPaths(graph, start, end, current, visited, allowSecondVisit) {
    let paths = [];
    let node = graph[current];
    let newVisited = visited.concat([current]);

    for (let i in node.neighbors) {
        let neighbor = node.neighbors[i];

        // we reached the end!
        // add to the list of paths
        if (neighbor.key == end) {
            let p = visited.concat([end]);
            paths.push(p);
            continue;
        }

        // if we hit the original start
        // then we skip it
        if (neighbor.key == start) {
            continue;
        }

        let canStillVisitTwice = allowSecondVisit;

        // is the neighbor is a small cave
        // and already visited enough times, skip it.
        let isVisited = visited.includes(neighbor.key);
        if (neighbor.isSmall && isVisited) {
            if (canStillVisitTwice) {
                canStillVisitTwice = false;
            }
            else {
                continue;
            }
        }

        // we can visit this neighbor
        let subPaths = findAllPaths(graph, start, end, neighbor.key, newVisited, canStillVisitTwice);

        paths = paths.concat(subPaths);
    }

    return paths;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let graph = parseInput(data);

    let paths1 = findAllPaths(graph, 'start', 'end', 'start', [], false);
    let paths2 = findAllPaths(graph, 'start', 'end', 'start', [], true);
    
    let res1 = paths1.length;
    let res2 = paths2.length;

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});
