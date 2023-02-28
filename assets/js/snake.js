class SnakeTile { //declaring SnakeTile prototype
    constructor(x,y) {
        this.height = Math.floor(400/size);
        this.width = Math.floor(400/size);
        this.snake = false;
        this.head = false;
        this.food = false;
        this.x = x;
        this.y = y;
        this.age = 0;
    }
}

//declaring variables
var size = 4;
var buttons = ["size4","size6","size10","size20"];
var myModal = new bootstrap.Modal(document.getElementById('myModal'));
var c = document.getElementById("gameCanvas"); var ctx = c.getContext("2d"); var tiles = []; var end; var len;
var newDirection = 1;
var direction = 1; //0 = up, 1 = right, 2 = down, 3 = left

// adding event listeners to the 5 buttons change difficulty only work when the game is ended
document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("size4").addEventListener("click", function () {
    if (end == false) {return;}
    ctx.clearRect(0, 0, 400, 400);
    size = 4; 
    for (let buttonchild of buttons) {document.getElementById(buttonchild).setAttribute("class","btn btn-secondary");}
    this.setAttribute("class", "btn btn-primary");
    startGame();
});
document.getElementById("size6").addEventListener("click", function () {
    if (end == false) {return;}
    ctx.clearRect(0, 0, 400, 400);
    size = 6; 
    for (let buttonchild of buttons) {document.getElementById(buttonchild).setAttribute("class","btn btn-secondary");}
    this.setAttribute("class", "btn btn-primary");
    startGame();
});
document.getElementById("size10").addEventListener("click", function () {
    if (end == false) {return;}
    ctx.clearRect(0, 0, 400, 400);
    size = 10; 
    for (let buttonchild of buttons) {document.getElementById(buttonchild).setAttribute("class","btn btn-secondary");}
    this.setAttribute("class", "btn btn-primary");
    startGame();
});
document.getElementById("size20").addEventListener("click", function () {
    if (end == false) {return;}
    ctx.clearRect(0, 0, 400, 400);
    size = 20; 
    for (let buttonchild of buttons) {document.getElementById(buttonchild).setAttribute("class","btn btn-secondary");}
    this.setAttribute("class", "btn btn-primary");
    startGame();
});


//functions
function startGame() {
    document.getElementById("start-button").setAttribute("class","btn btn-info d-none");
    tiles = [];
    newDirection = 1;
    direction = 1; //0 = up, 1 = right, 2 = down, 3 = left
    len = 1;
    end = false;
    instantiateTiles();
    tiles[(size*size-size)/2].snake = true; tiles[(size*size-size)/2].head = true; // setting initial position
    genFood();
    drawCanvas();
    main(); //recursive function running every 3s/size of board
}
function instantiateTiles() { //makes a new instance of a tile class size**2 times
    for (let i = 0; i < size*size; i++) {
        let y = Math.floor(i/size);
        let x = i%size;
        tiles.push(new SnakeTile(x,y));
    }
}
function drawCanvas() {  //using a canvas the array of tiles are coloured according to attributes of their corresponding object
    let relativeSize = Math.floor(400/size);
    for (let tile of tiles) {
        if (tile.head) {ctx.fillStyle = "#718f58";} 
        else if (tile.snake) {ctx.fillStyle = "#98bb7c";} 
        else if (tile.food) {ctx.fillStyle = "#eb7665";} 
        else {ctx.fillStyle = "#808080";}
        ctx.fillRect(relativeSize*0.1 + tile.x*relativeSize, relativeSize*0.1 + tile.y*relativeSize, tile.width*0.9, tile.height*0.9);
    }
}
function main() { //recursive function that controls the main body of the game
    setTimeout( function onTick() {
        ageSnakeTile();
        direction = newDirection;
        moveSnakeHead();
        if (end == true) return;
        growSnake();
        document.getElementById("score").innerText = `Length: ${len}`;
        newDirection = changeDirection();
        deleteSnakeTile();
        drawCanvas();
        main();
    }, 3000/size);

}
function moveSnakeHead() { //taking the position and direction of the head it calculates where to move it or if it will move to a game ending tile calls the game end function
    for (let tile of tiles.filter(tile => tile.head == true)) {
        let tileCurrent = tile;
        tile.head = false;
        if (direction == 0) {
            if (tileCurrent.y == 0) {endGame(); return;}
            if (tiles.filter(newTile => newTile.y == (tileCurrent.y - 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].snake == true) {endGame(); return;}
            tiles.filter(newTile => newTile.y == (tileCurrent.y - 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].snake = true;
            tiles.filter(newTile => newTile.y == (tileCurrent.y - 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].head = true;
        }
        else if (direction == 1) {
            if (tileCurrent.x == (size - 1)) {endGame(); return;}
            if (tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x + 1))[0].snake == true) {endGame(); return;}
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x + 1))[0].snake = true;
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x + 1))[0].head = true;}
        else if (direction == 2) {
            if (tileCurrent.y == (size - 1)) {endGame(); return;}
            if (tiles.filter(newTile => newTile.y == (tileCurrent.y + 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].snake == true) {endGame(); return;}
            tiles.filter(newTile => newTile.y == (tileCurrent.y + 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].snake = true;
            tiles.filter(newTile => newTile.y == (tileCurrent.y + 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].head = true;}
        else {
            if (tileCurrent.x == 0) {endGame(); return;}
            if (tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x - 1))[0].snake == true) {endGame(); return;}
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x - 1))[0].snake = true;
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x - 1))[0].head = true;}
    }
}
function changeDirection() {  //listens to arrow keys or wasd and changes the direction
    document.onkeydown = function(event) { //0 = up, 1 = right, 2 = down, 3 = left
        switch (event.key) {
            case "w":
                if (direction == 2) break;
                newDirection = 0;
            break;
            case "ArrowUp":
                if (direction == 2) break;
                newDirection = 0;
            break;
            case "d":
                if (direction == 3) break;
                newDirection = 1;
            break;
            case "ArrowRight":
                if (direction == 3) break;
                newDirection = 1;
            break;
            case "s":
                if (direction == 0) break;
                newDirection = 2;
            break;
            case "ArrowDown":
                if (direction == 0) break;
                newDirection = 2;
            break;
            case "a":
                if (direction == 1) break;
                newDirection = 3;
            break;
            case "ArrowLeft":
                if (direction == 1) break;
                newDirection = 3;
            break;
        }
    };
    return newDirection;
}
function ageSnakeTile() { // all snake tiles upon creation age once every tick
    for (let tile of tiles.filter(tile => tile.snake == true)) {
        ++tile.age;
    }
}
function deleteSnakeTile() { //the oldest tile is checked to see if it has been around longer than the length, if so it is deleted
    for (let tile of tiles.filter(tile => tile.snake == true)) {
        if ((len) == tile.age) {
            tile.age = 0;
            tile.snake = false;
        }
    }
}
function genFood() { //checks there are still free tiles, if not win, if so add food to a random one of those tiles
    if (tiles.filter(tile => tile.snake == false).length == 0) {gameWin(); return;}
    tiles.filter(tile => tile.snake == false)[Math.floor(Math.random()*tiles.filter(tile => tile.snake == false).length)].food = true;

}
function growSnake() { //if the head tile moves over to a tile with food == true, change the tile to food == false, generate a new food and increase the snake length by 1
    if (tiles.filter(tile => tile.head == true)[0].food == true) {
        tiles.filter(tile => tile.head == true)[0].food = false;
        ++len;
        genFood();
        drawCanvas();
        return true;
    } else return false;
}
function endGame() { //pulls up a modal with buttons to restart or click off the modal to change difficulty
    if (end == true) return;
    document.getElementById("reset-button").addEventListener("click", startGame);
    document.getElementById("reset-button").innerText = "Try Again";
    document.getElementById("modal-text").innerText = `Your final length was: ${len}`;
    document.getElementsByClassName("modal-title").innerText = "You lost :(";
    myModal.show();
    end = true;
}
function gameWin() { //pulls up a modal with buttons to restart or click off the modal to change difficulty
    drawCanvas();
    document.getElementById("reset-button").addEventListener("click", startGame);
    document.getElementById("reset-button").innerText = "Play Again";
    document.getElementById("modal-text").innerText = "Congratulations you won!";
    document.getElementById("modal-title").innerText = "Well done!";
    myModal.show(); 
    end = true;
}