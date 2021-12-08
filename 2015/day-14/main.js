const fs = require('fs');

function parseRows(rows) {
    let reindeer = [];
    for (let i in rows) {
        let parts = rows[i].split(' ');

        let name = parts[0];
        let kmps = parseInt(parts[3]);
        let flyTime = parseInt(parts[6]);
        let restTime = parseInt(parts[13]);

        reindeer.push({
            name: name,
            kmps: kmps,
            flyTime: flyTime,
            restTime: restTime
        });
    }

    return reindeer;
}

function race_old(original, t) {
    let reindeer = [...original];
    let res = [];

    for (let i in reindeer) {
        let r = reindeer[i];

        let dist = 0;
        let elapsedTime = 0;

        let cycleTime = r.flyTime + r.restTime;
        let cycleDist = r.kmps * r.flyTime;

        while (elapsedTime + cycleTime < t) {
            elapsedTime += cycleTime;
            dist += cycleDist;
        }

        let remainingTime = t - elapsedTime;

        if (r.flyTime < remainingTime) {
            dist += cycleDist;
        }
        else {
            dist += r.kpms * remainingTime
        }

        res.push(dist);
    }

    return res;
}

function race(reindeer, time) {
    let res = [];
    for (let i = 0; i < reindeer.length; ++i) {
        res.push({
            dist: 0,
            pts: 0,
            isFlying: true,
            t: 0
        });
    }

    for (let t = 0; t < time ; ++t) {
        let leadDist = 0;
        let leadIndexes = [];

        // evaluate distances
        for (let i = 0; i < reindeer.length; ++i) {
            if (res[i].isFlying) {
                res[i].dist += reindeer[i].kmps;
                res[i].t += 1;
                if (res[i].t >= reindeer[i].flyTime) {
                    res[i].isFlying = false;
                    res[i].t = 0;
                }
            }
            else {
                res[i].t += 1;
                if (res[i].t >= reindeer[i].restTime) {
                    res[i].isFlying = true;
                    res[i].t = 0;
                }
            }

            if (res[i].dist == leadDist) {
                leadIndexes.push(i);
            }
            else if (res[i].dist > leadDist) {
                leadIndexes = [i];
                leadDist = res[i].dist;
            }
        }

        // award points to the leaders
        for (let key in leadIndexes) {
            let index = leadIndexes[key];
            res[index].pts += 1;
        }
    }

    return res;
}

function findMax(lst, prop) {
    let max = lst[0][prop];
    for (let i = 1; i < lst.length; ++i) {
        if (lst[i][prop] > max) {
            max = lst[i][prop]
        }
    }
    return max;
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    
    let rows = data.split('\r\n');

    let reindeer = parseRows(rows);

    let res = race(reindeer, 2503);

    let res1 = findMax(res, 'dist');
    let res2 = findMax(res, 'pts');

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});
