const fs = require('fs');

function parseInput(data) {
    let obj = [];

    let lines = data.split("\r\n");

    for (let i in lines) {

        parts = lines[i].split(': ');

        let item = {}

        let props = parts[1].split(', ');

        for (let k in props) {
            let prop = props[k].split(' ');
            item[prop[0]] = parseInt(prop[1]);
        }

        obj[parts[0]] = item;
    }

    return obj;
}

function computeScore(ingredients, used, calories) {
    let c = 0, d = 0, f = 0, t = 0, cal = 0;

    if (used['Cinnamon'] == 56) {
        console.log('here');
    }

    for (let key in used) {
        let tsp = used[key];
        let ingredient = ingredients[key];

        c += ingredient.capacity * tsp;
        d += ingredient.durability * tsp;
        f += ingredient.flavor * tsp;
        t += ingredient.texture * tsp;
        cal += ingredient.calories * tsp;
    }

    if (calories && cal != calories) {
        return 0;
    }

    c = c > 0 ? c : 0;
    d = d > 0 ? d : 0;
    f = f > 0 ? f : 0;
    t = t > 0 ? t : 0;

    return c * d * f * t;
}

function buildCookie(ingredients, available, used, tspLeft, calories) {
    // if not teaspoons are left, calculate the final
    // score and return
    if (tspLeft <= 0) {
        return computeScore(ingredients, used, calories);
    }

    let remainingAvailable = [...available];
    let newUsed = {...used};

    let ingredient = remainingAvailable.pop();
    newUsed[ingredient] = 0;

    // use all remaning space if only one ingredient
    if (remainingAvailable.length == 0) {
        newUsed[ingredient] = tspLeft;
        return computeScore(ingredients, newUsed, calories);
    }

    let maxScore = null;

    for (let tsp = 0; tsp < tspLeft; ++tsp) {
        newUsed[ingredient] = tsp;
        
        let score = buildCookie(ingredients, remainingAvailable, newUsed, tspLeft - tsp, calories);

        if (maxScore == null || maxScore < score) {
            maxScore = score;
        }
    }

    return maxScore;
}

function optimizeCookieScore(ingredients, calories) {

    let lst = Object.keys(ingredients);

    return buildCookie(ingredients, lst, [], 100, calories);
}

fs.readFile(__dirname + '/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log("Error while reading input file: " + err.message);
        exit(1);
    }

    let ingredients = parseInput(data);
    
    let res1 = optimizeCookieScore(ingredients);
    let res2 = optimizeCookieScore(ingredients, 500);

    console.log("OUTPUT 1 >> " + res1);
    console.log("OUTPUT 2 >> " + res2);
});
