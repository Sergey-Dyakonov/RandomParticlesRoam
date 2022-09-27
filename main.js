const M = 8, N = 8;
const x = 4, y = 4;
const p0 = 0.25, p1 = 0.25, p2 = 0.25, p3 = 0.25, p4 = 0;
let north = 0, south = 0, west = 0, east = 0, stop = 0;
const particles = 100000;

class Particle {

    constructor(xCord, yCord) {
        this.x = xCord;
        this.y = yCord;
    }

    move() {
        let rand = Math.random();
        if (rand < p0) {
            this.y++;
        } else if (rand < p0 + p1) {
            this.y--;
        } else if (rand < p0 + p1 + p2) {
            this.x++;
        } else if (rand < p0 + p1 + p2 + p3) {
            this.x--;
        }
    }
}


for (let i = 0; i < particles; i++) {
    let point = new Particle(x, y);
    while (point.x < M && point.x > 0
    && point.y < N && point.y > 0) {
        point.move();
    }
    if (point.y === M) {
        north++;
    } else if (point.y === 0) {
        south++;
    } else if (point.x === N) {
        east++;
    } else if (point.x === 0) {
        west++;
    }
}

console.log("North: " + north / particles);
console.log("South: " + south / particles);
console.log("East: " + east / particles);
console.log("West: " + west / particles);