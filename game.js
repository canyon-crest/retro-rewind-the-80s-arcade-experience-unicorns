let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let scoreText = document.getElementById("score");
let gridSize = 20;
let cellSize = 20;
let headSize = 40;
let twilightImg = new Image();
twilightImg.src = "images/twilight.png";
let sparkleImg = new Image();
sparkleImg.src = "images/sparkle.png";
let twilightLoaded = false;
let sparkleLoaded = false;
twilightImg.onload = function() {
    twilightLoaded = true;
};
sparkleImg.onload = function() {
    sparkleLoaded = true;
};
let snake = [];
let directionX = 1;
let directionY = 0;
let facing = "right";
let foodX = 5;
let foodY = 5;
let score = 0;
let gameOver = false;

function startGame() {
    snake = [{ x: 10, y: 10 }];
    directionX = 1;
    directionY = 0;
    facing = "right";
    score = 0;
    gameOver = false;
    scoreText.textContent = "Score: 0";
    makeNewFood();
}

function makeNewFood() {
    foodX = Math.floor(Math.random() * gridSize);
    foodY = Math.floor(Math.random() * gridSize);
}

document.addEventListener("keydown", function(event) {
    if (gameOver) {
        if (event.key === " ") startGame();
        return;
    }
    if (event.key === "ArrowUp" && directionY !== 1) {
        directionX = 0;
        directionY = -1;
    }
    if (event.key === "ArrowDown" && directionY !== -1) {
        directionX = 0;
        directionY = 1;
    }
    if (event.key === "ArrowLeft" && directionX !== 1) {
        directionX = -1;
        directionY = 0;
        facing = "left";
    }
    if (event.key === "ArrowRight" && directionX !== -1) {
        directionX = 1;
        directionY = 0;
        facing = "right";
    }
});

function moveSnake() {
    if (gameOver) return;
    let newHeadX = snake[0].x + directionX;
    let newHeadY = snake[0].y + directionY;
    if (newHeadX < 0 || newHeadX >= gridSize || newHeadY < 0 || newHeadY >= gridSize) {
        gameOver = true;
        return;
    }
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === newHeadX && snake[i].y === newHeadY) {
            gameOver = true;
            return;
        }
    }
    let ateFood = (newHeadX === foodX && newHeadY === foodY);
    if (ateFood) {
        snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
        score = score + 1;
        scoreText.textContent = "Score: " + score;
        makeNewFood();
    }
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }
    snake[0].x = newHeadX;
    snake[0].y = newHeadY;
}

function drawGame() {
    ctx.fillStyle = "rgb(255, 186, 240)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (sparkleLoaded) {
        ctx.drawImage(sparkleImg, foodX * cellSize, foodY * cellSize, cellSize, cellSize);
    } else {
        ctx.fillStyle = "red";
        ctx.fillRect(foodX * cellSize, foodY * cellSize, cellSize, cellSize);
    }
    for (let i = 1; i < snake.length; i++) {
        let part = snake[i];
        if (sparkleLoaded) {
            ctx.drawImage(sparkleImg, part.x * cellSize, part.y * cellSize, cellSize, cellSize);
        } else {
            ctx.fillStyle = "violet";
            ctx.fillRect(part.x * cellSize, part.y * cellSize, cellSize, cellSize);
        }
    }
    let offset = (headSize - cellSize) / 2;
    let headX = snake[0].x * cellSize - offset;
    let headY = snake[0].y * cellSize - offset;
    if (twilightLoaded) {
        if (facing === "left") {
            ctx.drawImage(twilightImg, headX, headY, headSize, headSize);
        } else {
            ctx.save();
            ctx.translate(headX + headSize, headY);
            ctx.scale(-1, 1);
            ctx.drawImage(twilightImg, 0, 0, headSize, headSize);
            ctx.restore();
        }
    } else {
        ctx.fillStyle = "green";
        ctx.fillRect(headX, headY, headSize, headSize);
    }
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "bold 30px 'Courier New', monospace";
        ctx.fillText("Game Over", 200, 190);
        ctx.font = "16px 'Courier New', monospace";
        ctx.fillText("Press SPACE to restart", 200, 220);
    }
}

// Added event listener for character selection
document.getElementById("ponySelect").addEventListener("change", function(event) {
    twilightLoaded = false; 
    twilightImg.src = event.target.value; 
});

startGame();
setInterval(function() {
    moveSnake();
    drawGame();
}, 100);
