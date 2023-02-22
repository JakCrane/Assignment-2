class SnakeTile {
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
var c = document.getElementById("gameCanvas"); var ctx = c.getContext("2d"); var tiles = []; var length;
var direction = 1; //0 = up, 1 = right, 2 = down, 3 = left
var size = 200
document.addEventListener("DOMContentLoaded", function () {
    startGame();
    main();
})
startGame = () => {
    instantiateTiles();
    //console.log(JSON.parse(JSON.stringify(tiles)), "initialise function")
    if (size % 2 == 0) {
        tiles[(size**2-size)/2].snake = true;
        tiles[(size**2-size)/2].head = true;}
    else {
        tiles[Math.floor((size**2)/2)].snake = true;
        tiles[Math.floor((size**2)/2)].head = true;}
    drawCanvas();
    length = 1;
    genFood();
    //console.log(JSON.parse(JSON.stringify(tiles)), "start function")
}
instantiateTiles = () => {
    for (let i = 0; i < size**2; i++) {
        let y = Math.floor(i/size)
        let x = i%size
        tiles.push(new SnakeTile(x,y))
    }
}
drawCanvas = () => {  
    let relativeSize = Math.floor(400/size)
    for (let tile of tiles) {
        if (tile.snake) {ctx.fillStyle = "#98bb7c";} 
        else if (tile.food) {ctx.fillStyle = "#E6A99F";} 
        else {ctx.fillStyle = "#808080";}
        ctx.fillRect(relativeSize*0.1 + tile.x*relativeSize, relativeSize*0.1 + tile.y*relativeSize, tile.width*0.9, tile.height*0.9)
    }
}
main = () => {
    setTimeout( function onTick() {
        growSnake();
        if (tiles.filter(tiles => tiles.food).length == 0) {genFood()}
        ageSnakeTile();
        moveSnakeHead();
        changeDirection();
        deleteSnakeTile(length);
        drawCanvas();
        main();
    }, 100);
};
moveSnakeHead = () => {
    for (let tile of tiles.filter(tile => tile.head == true)) {
        let tileCurrent = tile
        tile.head = false
        if (direction == 0) {
            tiles.filter(newTile => newTile.y == (tileCurrent.y - 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].snake = true;
            tiles.filter(newTile => newTile.y == (tileCurrent.y - 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].head = true;
        }
        else if (direction == 1) {
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x + 1))[0].snake = true;
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x + 1))[0].head = true;}
        else if (direction == 2) {
            tiles.filter(newTile => newTile.y == (tileCurrent.y + 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].snake = true;
            tiles.filter(newTile => newTile.y == (tileCurrent.y + 1)).filter(newTile => newTile.x == (tileCurrent.x))[0].head = true;}
        else {
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x - 1))[0].snake = true;
            tiles.filter(newTile => newTile.y == tileCurrent.y).filter(newTile => newTile.x == (tileCurrent.x - 1))[0].head = true;}
    }
};
changeDirection = () => {  //0 = up, 1 = right, 2 = down, 3 = left
    document.onkeydown = function(event) {
        console.log(typeof event.key)
        switch (event.key) {
            case "w":
                direction = 0;
            break;
            case "ArrowUp":
                direction = 0;
            break;
            case "d":
                direction = 1;
            break;
            case "ArrowRight":
                direction = 1;
            break;
            case "s":
                direction = 2;
            break;
            case "ArrowDown":
                direction = 2;
            break;
            case "a":
                direction = 3;
            break;
            case "ArrowLeft":
                direction = 3;
            break;
        }
    };
};
ageSnakeTile = () => {
    for (tile of tiles.filter(tile => tile.snake == true)) {
        ++tile.age
    };
};
deleteSnakeTile = (length) => {
    for (tile of tiles.filter(tile => tile.snake == true)) {
        if ((length) == tile.age) {
            tile.age = 0;
            tile.snake = false;
        }
    }
}
genFood = () => {
    tiles[Math.floor(Math.random()*tiles.filter(tile => tile.snake == false).length)].food = true

}
growSnake = () => {
    if (tiles.filter(tile => tile.head == true)[0].food == true) {
        tiles.filter(tile => tile.head == true)[0].food = false;
        ++length;
    }
}
//  hasGameEnded() {
//      define boundary conditions
//  }
//  randomFoodPosition() {}
//  generateFood() {}
//  growSnake() {}
//  score() {}