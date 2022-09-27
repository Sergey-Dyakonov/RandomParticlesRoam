const prompt = require('prompt-sync')({sigint: true});

class ModulationData {
    constructor(M, N, n0, m0, probabilities, quantity) {
        this.M = M;
        this.N = N;
        this.n0 = n0;
        this.m0 = m0;
        this.probabilities = probabilities;
        this.quantity = quantity;
    }

    isInGrid(n, m) {
        if (n < 0 || n > this.N) {
            return false;
        }
        return !(m < 0 || m > this.M);
    }
}

class Particle {
    constructor(nCord, mCord) {
        this.n = nCord;
        this.m = mCord;
    }

    move(probabilities) {
        let rand = Math.random();
        let edge = 0;
        for (let i = 0; i < probabilities.length; i++) {
            edge += probabilities[i];
            if (rand < edge) {
                if (i === 1) {
                    this.n--;
                } else if (i === 2) {
                    this.n++;
                }
                if (i === 3) {
                    this.m--;
                }
                if (i === 4) {
                    this.m++;
                }
                return i;
            }
        }
    }
}

console.log("Welcome to Random Particles Roam Generator!\n");
let answer = prompt("Do you want to enter values manually or to run tests? (M - manually / T - test): ");
const SPLIT = "--------------------------------------------";

while (answer !== "M" && answer !== "T") {
    console.log("Unknown option! Try again...\n");
    answer = prompt("(M - manually / T - test): ");
}

if (answer === "M") {
    const M = prompt("Enter M (height, north -> south): ");
    const N = prompt("Enter M (length, west -> east): ");
    let buf = prompt("Enter start point (x,y): ");
    let splitted = buf.split(",");
    const n0 = splitted[0];
    const m0 = splitted[1];
    const quantity = prompt("Enter number of particles: ");
    let probabilities = new Array(5);
    probabilities[0] = prompt("Enter p0 (probability of stopping): ");
    probabilities[1] = prompt("Enter p1 (probability of reaching north): ");
    probabilities[2] = prompt("Enter p2 (probability of reaching south): ");
    probabilities[3] = prompt("Enter p3 (probability of reaching west): ");
    probabilities[4] = prompt("Enter p4 (probability of reaching east): ");
    compute(M, N, n0, m0, probabilities, quantity);
} else if (answer === "T") {
    runTests();
}

function runTests() {
    compute(7, 7, 4, 4, [0, 0.25, 0.25, 0.25, 0.25], 100);
    compute(7, 7, 4, 4, [0, 0.25, 0.25, 0.25, 0.25], 10_000);
    compute(7, 7, 4, 4, [0.04, 0.25, 0.25, 0.25, 0.25], 10_000);
    compute(7, 7, 4, 4, [0.2, 0.25, 0.25, 0.25, 0.25], 10_000);
    compute(7, 7, 4, 4, [0.04, 0.21, 0.25, 0.25, 0.25], 10_000);
    compute(7, 7, 4, 4, [0.2, 0.2, 0.2, 0.2, 0.2], 10_000);
    compute(9, 9, 5, 5, [0, 0, 0, 0.5, 0.5], 10_000);
    compute(9, 9, 5, 3, [0, 0, 0, 0.5, 0.5], 10_000);
    compute(9, 9, 5, 8, [0, 0, 0, 0.5, 0.5], 10_000);
}

function compute(M, N, n0, m0, probabilities, quantity) {
    let data = new ModulationData(M, N, n0, m0, probabilities, quantity);
    if (isValidData(data)) {
        console.log(SPLIT + "\nINPUT DATA:\n");
        console.log("M = " + data.M + "(height)\tN = " + data.N + "(length)");
        console.log("Start point: [" + data.m0 + ", " + data.n0 + "]");
        console.log(data.probabilities);
        console.log("Points quantity: " + data.quantity);
        console.log(SPLIT + "\nTEST RESULT:\n");
        printResult(data);
    } else console.log("Invalid data!\n" +
        "1. M & N must be positive\n" +
        "2. Start point must not be out of bounds of the grid\n" +
        "3. Number of particles must be positive\n" +
        "4. Probalilities must be between 0 and 1\n" +
        "5. Sum of all probabilities must equal to 1");
    console.log(SPLIT + "\n");
}

function isValidData(data) {
    if (data.M < 0 || data.N < 0 || data.quantity < 0) {
        return false;
    }
    if (data.m0 < 0 || data.m0 > data.M || data.n0 < 0 || data.n0 > data.N) {
        return false;
    }
    let sum = 0;
    data.probabilities.forEach(function (p) {
        if (p < 0 || p > 1) {
            return false;
        }
        sum += parseFloat(p);
    });
    return sum === 1;
}

function printResult(data) {
    let map = new Map();
    for (let i = 0; i < data.probabilities.length; i++) {
        map.set(i, 0);
    }
    for (let i = 0; i < data.quantity; i++) {
        let particle = new Particle(data.n0, data.m0);
        let direction;
        while (data.isInGrid(particle.n, particle.m)) {
            direction = particle.move(data.probabilities);
            if (direction === 0) {
                break;
            }
        }
        map.set(direction, map.get(direction) + 1);
    }
    for (let i = 0; i < map.size; i++) {
        let Q = map.get(i) / data.quantity;
        console.log("Q" + i + ": " + Q + "\tUns: " + Math.sqrt((Q * (1 - Q)) / data.quantity));
    }
}


