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

const shapes = [shape1, shape2, shape3, shape4, shape5, shape6, shape7]
const colors = ["rgba(0, 255, 255, 1)", "rgba(240, 0, 255, 1)", "rgba(255, 183, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)", "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)"]

const canvas = document.getElementById("game")
const context = canvas.getContext('2d');


String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

class grid{
    constructor(){
        this.matrix = []
        this.blankString = ".........."
        this.makeMatrix();
    }

    makeMatrix() {
        for (let y = 0; y < 20; y++) {
            this.matrix.push(this.blankString);
        }
    }

    addToMatrix(x, y, c) {
        let str = this.matrix[y]
        str = str.replaceAt(x, c)
        this.matrix[y] = str
    }

    getColor(char) {
        return colors[char.charCodeAt(0) - 48]
    }

    draw() {
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < this.matrix[y].length; x++) {
                if (this.matrix[y][x] != '.') {
                    DrawSquare(x, y, 45, this.getColor(this.matrix[y][x]));
                }
            }
        }
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
            for (let x = 0; x < this.shape[this.rotation][y].length; x++) {
                if (this.shape[this.rotation][y][x] == 'x') {
                    let rx = this.x + x;
                    let ry = this.y + y;
                    let clr = String.fromCharCode(this.color + 48)
                    grid.addToMatrix(rx, ry, clr);

                }
            }
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

    draw() {
        for (let y = 0; y < this.shape[this.rotation].length; y++) {
            for (let x = 0; x < this.shape[this.rotation][y].length; x++) {
                if (this.shape[this.rotation][y][x] == 'x') {
                    DrawSquare(x + this.x, y + this.y, 45, colors[this.color]);
                }
            }
        }
    }
}

var currentShape = 0
var nextShape = 0
var heldShape = 0
pos = 0

grid = new grid();

var holds = 0;

function renderLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);


    currentShape.draw();
    nextShape.draw();
    grid.draw();

    drawRect(0, 0, 45 * 10, 45 * 20, "gray")

    drawRect(480, 50, 45 * 4.3, 45 * 4.3, "gray")
}

function getNewShape() {
    currentShape = nextShape;
    currentShape.x = 3;
    currentShape.y = -2;
    let num = Math.floor(Math.random() * shapes.length);
    let s = shapes[num];
    nextShape = new Shape(10.3, 1.2, s, num);
    grid.checkLines();
}

function getTime() {
    d = new Date()
    return d.getTime();
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
}

let lastPlayerInput = 0
function gameLoop() {
    if (!currentShape.Move(0, 1)) {
        if (lastPlayerInput < getTime()) {
            placeShape();

        }
    }
}

function holdShape() {
    if (holds >= 1)
        return
    holds += 1;
    let temp = heldShape;
    heldShape = currentShape;
    temp.x = 3;
    temp.y = -2;
    heldShape.x = 10.3;
    heldShape.y = 3;
    currentShape = temp;
}

lastMoveTs = 0;
let d = new Date();
function moveBlock(dir) {
    d = new Date();
    if (lastMoveTs < d.getTime()) {
        lastMoveTs = d.getTime() + 40;
        currentShape.Move(dir, 0);
        return;
    }
}

getNewShape();
getNewShape();
console.log("starting loops")
var id = window.setInterval(renderLoop, 10);
var id = window.setInterval(gameLoop, 200);

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) {
        moveBlock(-1);
    }
    else if (event.keyCode == 39) {
        moveBlock(1);
        lastPlayerInput = getTime() + 1000;
    }
    else if (event.keyCode == 38) {
        currentShape.rotate();
        lastPlayerInput = getTime() + 1000;
    }
    else if (event.keyCode == 40) {
        currentShape.Move(0, 1);
        lastPlayerInput = getTime() + 1000;
    }
    else if (event.keyCode == 32) {
        currentShape.drop();
        getNewShape()
        holds = 0;
    }
    else if (event.keyCode == 16) {
        holdShape();
        console.log("d")
    }
});
