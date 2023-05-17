const shape1 = [["..x.",
                "..x.",
                "..x.",
                "..x."],
               ["....",
                "xxxx",
                "....",
                "...."]]

const shape2 = [["....",
                "..x.",
                ".xxx",
                "...."],

                ["....",
                "..x.",
                "..xx",
                "..x."],
                ["....",
                "....",
                ".xxx",
                "..x."],
                ["....",
                "..x.",
                ".xx.",
                "..x."],]

const shape3 = [["....",
                "..x.",
                "..x.",
                "..xx"],

                ["....",
                "....",
                ".xxx",
                ".x.."],

                ["....",
                ".xx.",
                "..x.",
                "..x."],

                ["....",
                "...x",
                ".xxx",
                "...."],]

const shape4 = [["....",
                "..x.",
                "..x.",
                ".xx."],

                ["....",
                ".x..",
                ".xxx",
                "...."],

                ["....",
                "..xx",
                "..x.",
                "..x."],

                ["....",
                "....",
                ".xxx",
                "...x"],]

const shape5 = [["....",
                "..xx",
                "..xx",
                "...."]]

const shape6 = [["....",
                "..xx",
                ".xx.",
                "...."],
                [".x..",
                ".xx",
                "..x.",
                "...."]]

const shape7 = [["....",
                ".xx.",
                "..xx",
                "...."],
               ["..x.",
                ".xx",
                ".x..",
                "...."]]


class color{
    constructor(r, g, b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    get() {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    }

    ghost() {
        return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + 0.5 + ")";
    }
}


class grid{
    constructor(){
        this.matrix = []
        this.blankString = ".........."
        this.makeMatrix();
    }

    makeMatrix() {
        let temp = []
        for (let y = 0; y < 20; y++) {
            temp.push(this.blankString);
        }
        this.matrix = temp;
    }

    addToMatrix(x, y, c) {
        let str = this.matrix[y];
        str = str.replaceAt(x, c);
        this.matrix[y] = str;
    }

    getColor(char) {
        return colors[char.charCodeAt(0) - 48]
    }

    draw() {
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (this.matrix[y][x] != '.') {
                    DrawSquare(x, y, 45, this.getColor(this.matrix[y][x]).get());
                }
            }
        }
    }

    reset() {
        this.makeMatrix();
    }

    isFilled(x, y) {
        try {
            return this.matrix[y][x] != '.';
        }
        catch {
            return false;
        }
    }

    clearLine(line) {
        this.matrix[line] = this.blankString;
        for (let y = line; y > 0 ; y--) {
            this.matrix[y] = this.matrix[y - 1];
        }
    }

    checkLines() {
        for (let y = 0; y < this.matrix.length; y++) {
            let isFull = true;
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (this.matrix[y][x] == '.') {
                    isFull = false;
                    break
                }
            }
            if (isFull) {
                this.clearLine(y);
                score += 100;
                speed -= 5;
            }
        }
    }

    isValidSpace(x, y) {
        if (x < 0) 
            return false;

        if (x > 9)
            return false;

        if (y >= 20) 
            return false;

        if (y < 0)
            return true;

        return !this.isFilled(x, y);
    }
}


class Shape {
    constructor(x, y, shape, color) {
        this.x = x
        this.y = y
        this.rotation = 0
        this.shape = shape
        this.color = color
    }

    Move(nx, ny) {
        for (let y = 0; y < this.shape[this.rotation].length; y++) {
            for (let x = 0; x < this.shape[this.rotation][y].length; x++) {
                if (this.shape[this.rotation][y][x] == 'x') {
                    let rx = nx + x + this.x;
                    let ry = ny + y + this.y;

                    if (rx < 0) {
                        return false;
                    }
                    if (rx > 9)
                        return false;

                    if (ry >= 20) {
                        return false;
                    }

                    if (grid.isFilled(rx, ry))
                        return false;
                }
            }
        }

        this.x += nx;
        this.y += ny;
        return true;
    }

    placeShape() {
        for (let y = 0; y < this.shape[this.rotation].length; y++) {
            try{
                for (let x = 0; x < this.shape[this.rotation][y].length; x++) {
                    if (this.shape[this.rotation][y][x] == 'x') {
                        let rx = this.x + x;
                        let ry = this.y + y;
                        let clr = String.fromCharCode(this.color + 48)
                        grid.addToMatrix(rx, ry, clr);

                    }
                }
            }
            catch{
                gameOver();
                break;
            }
        }
    }

    placeGhost() {
        while (this.Move(0, 1)) {
            continue;
        }
    }

    drop() {
        while (this.Move(0, 1)) {
            continue;
        }
        this.placeShape();
    }

    rotate() {
        let lastRot = this.rotation
        this.rotation++;
        if (this.rotation == this.shape.length)
            this.rotation = 0;
        for (let y = 0; y < this.shape[this.rotation].length; y++) {
            for (let x = 0; x < this.shape[this.rotation][y].length; x++) {
                if (this.shape[this.rotation][y][x] == 'x') {
                    let rx = x + this.x;
                    let ry = y + this.y;
                    if (!grid.isValidSpace(rx, ry)) {
                        this.rotation = lastRot;
                        return;
                    }

                }
            }
        }

    }

    drawGhost() {
        for (let y = 0; y < this.shape[this.rotation].length; y++) {
            for (let x = 0; x < this.shape[this.rotation][y].length; x++) {
                if (this.shape[this.rotation][y][x] == 'x') {
                    DrawSquare(x + this.x, y + this.y, 45, colors[this.color].ghost());
                }
            }
        }
    }

    draw() {
        for (let y = 0; y < this.shape[this.rotation].length; y++) {
            for (let x = 0; x < this.shape[this.rotation][y].length; x++) {
                if (this.shape[this.rotation][y][x] == 'x') {
                    DrawSquare(x + this.x, y + this.y, 45, colors[this.color].get());
                }
            }
        }
    }
}

const shapes = [shape1, shape2, shape3, shape4, shape5, shape6, shape7]

const canvas = document.getElementById("game")
const context = canvas.getContext('2d');

const colors = [new color(0, 255, 255, 1), new color(240, 0, 255, 1), new color(255, 183, 0, 1), new color(0, 0, 255, 1), new color(255, 255, 0, 1), new color(255, 0, 0, 1), new color(0, 255, 0, 1)]

var paused = false;

var currentShape = 0
var nextShape = 0
var heldShape = 0
var ghost = 0

let score = 0;
let highScore = 0;
pos = 0

grid = new grid();

var holds = 0;


String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function getTime() {
    d = new Date()
    return d.getTime();
}

function renderLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    ghost = new Shape(currentShape.x, currentShape.y, currentShape.shape, currentShape.color);
    ghost.rotation = currentShape.rotation;
    ghost.placeGhost();

    ghost.drawGhost();

    currentShape.draw();
    nextShape.draw();

    if (heldShape != 0)
        heldShape.draw();

    grid.draw();

    drawRect(0, 0, 45 * 10, 45 * 20, "gray")
    drawRect(480, 50, 45 * 4.3, 45 * 4.3, "gray")
    drawRect(480, 275, 45 * 4.3, 45 * 4.3, "gray")

    context.font = "37px serif";
    context.fillStyle = "white";
    context.fillText("Score: " + score, 475, 525)

    context.font = "20px serif";
    context.fillStyle = "white";
    context.fillText("High Score: " + highScore, 475, 560)
}

function getNewShape() {
    if (nextShape == 0) {
        let num = Math.floor(Math.random() * shapes.length);
        let s = shapes[num];
        nextShape = new Shape(10.3, 1.2, s, num);
    }

    currentShape = nextShape;
    currentShape.x = 3;
    currentShape.y = -2;
    let num = Math.floor(Math.random() * shapes.length);
    let s = shapes[num];
    nextShape = new Shape(10.3, 1.2, s, num);
    grid.checkLines();
}

function gameOver() {
    grid.reset();
    currentShape = 0;
    ghost = 0;
    nextShape = 0;
    heldShape = 0;
    if (score > highScore)
        highScore = score;
    speed = 400;
    score = 0;
}

function drawRect(x, y, width, height, color) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = "5"
    context.rect(x, y, width, height)
    context.stroke();
}

function DrawSquare(x, y, width, color) {
    context.beginPath();
    context.fillStyle = color;
    context.rect(x * 45, y * 45, width, width)
    context.fill();
}

function placeShape() {
    currentShape.placeShape();
    getNewShape();
    holds = 0;
    score += 10;
}

let lastPlayerInput = 0
let gameUpdateTs = 0;
let speed = 400;
function gameLoop() {
    if (paused)
        return;
    if (gameUpdateTs > getTime()) 
        return

    gameUpdateTs = getTime() + speed;
    
    if (!currentShape.Move(0, 1)) {
        if (lastPlayerInput < getTime()) {
            placeShape();
        }
    }
}

function holdShape() {
    if (heldShape == 0) {
        heldShape = currentShape;
        getNewShape();
        heldShape.rotation = 0;
        heldShape.x = 10.3;
        heldShape.y = 6.3;
        return
    }
    if (holds >= 1)
        return
    holds += 1;
    let temp = heldShape;
    heldShape = currentShape;
    temp.x = 3;
    temp.y = -2;
    heldShape.x = 10.3;
    heldShape.y = 6.3;
    currentShape = temp;
}

lastMoveTs = 0;
function moveBlock(dir) {
    if (paused)
        return;

    if (lastMoveTs < getTime()) {
        lastMoveTs = getTime() + 40;
        currentShape.Move(dir, 0);
        return;
    }
}

getNewShape();

console.log("starting loops")
window.setInterval(renderLoop, 10);
window.setInterval(gameLoop, 10);

document.addEventListener('keydown', function (event) {
    if (paused){
        console.log(grid.matrix)
    }

    if (event.keyCode == 37 || event.keyCode == 65) {
        moveBlock(-1);
    }
    else if (event.keyCode == 39 || event.keyCode == 68) {
        moveBlock(1);
        lastPlayerInput = getTime() + 1000;
    }
    else if (event.keyCode == 38 || event.keyCode == 87) {
        currentShape.rotate();
        lastPlayerInput = getTime() + 1000;
    }
    else if (event.keyCode == 40 || event.keyCode == 83) {
        currentShape.Move(0, 1);
        lastPlayerInput = getTime() + 1000;
    }
    else if (event.keyCode == 32) {
        currentShape.drop();
        getNewShape()
        holds = 0;
        score += 10;
    }
    else if (event.keyCode == 16 || event.keyCode == 67) {
        holdShape();
    }
});