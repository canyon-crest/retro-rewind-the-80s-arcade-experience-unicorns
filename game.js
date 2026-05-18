let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let scoreText = document.getElementById("score");

let gridSize = 20;            // 20 cells across and down
let cellSize = 20;            // each cell is 20 pixels (400 / 20)
let headSize = 40;            // <-- Twilight's size on screen (bigger than cellSize). Change this number to make her bigger or smaller!

// ===== LOAD IMAGES =====
let twilightImg = new Image();
twilightImg.src = "images/twilight.png";

let sparkleImg = new Image();
sparkleImg.src = "images/sparkle.png";

// Track whether each image actually loaded
let twilightLoaded = false;
let sparkleLoaded = false;
twilightImg.onload = function() { twilightLoaded = true; };
sparkleImg.onload = function() { sparkleLoaded = true; };

// ===== GAME VARIABLES =====
let snake = [];               // list of body parts, snake[0] is the head
let directionX = 1;           // 1 = right, -1 = left, 0 = no movement
let directionY = 0;           // 1 = down,  -1 = up,   0 = no movement
let facing = "right";         // which way Twilight is looking
let foodX = 5;
let foodY = 5;
let score = 0;
let gameOver = false;

// ===== START THE GAME =====
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

// ===== MAKE FOOD IN A RANDOM SPOT =====
function makeNewFood() {
  foodX = Math.floor(Math.random() * gridSize);
  foodY = Math.floor(Math.random() * gridSize);
}

// ===== KEYBOARD CONTROLS =====
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

// ===== MOVE THE SNAKE (runs every tick) =====
function moveSnake() {
  if (gameOver) return;

  let newHeadX = snake[0].x + directionX;
  let newHeadY = snake[0].y + directionY;

  // Check if the snake hit a wall
  if (newHeadX < 0 || newHeadX >= gridSize || newHeadY < 0 || newHeadY >= gridSize) {
    gameOver = true;
    return;
  }

  // Check if the snake hit itself
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === newHeadX && snake[i].y === newHeadY) {
      gameOver = true;
      return;
    }
  }

  // Check if the snake ate food
  let ateFood = (newHeadX === foodX && newHeadY === foodY);

  // If we ate food, add a new body part at the end (the snake grows)
  if (ateFood) {
    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
    score = score + 1;
    scoreText.textContent = "Score: " + score;
    makeNewFood();
  }

  // Move every body part to where the part in front of it was
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }

  // Move the head to its new spot
  snake[0].x = newHeadX;
  snake[0].y = newHeadY;
}

// ===== DRAW EVERYTHING =====
function drawGame() {
  // Draw the pink background
  ctx.fillStyle = "rgb(255, 186, 240)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the food (sparkle image, or red square as fallback)
  if (sparkleLoaded) {
    ctx.drawImage(sparkleImg, foodX * cellSize, foodY * cellSize, cellSize, cellSize);
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(foodX * cellSize, foodY * cellSize, cellSize, cellSize);
  }

  // Draw the body sparkles (everything behind the head)
  for (let i = 1; i < snake.length; i++) {
    let part = snake[i];
    if (sparkleLoaded) {
      ctx.drawImage(sparkleImg, part.x * cellSize, part.y * cellSize, cellSize, cellSize);
    } else {
      ctx.fillStyle = "violet";
      ctx.fillRect(part.x * cellSize, part.y * cellSize, cellSize, cellSize);
    }
  }

  // Draw the head (Twilight Sparkle) — bigger than the grid, centered on her cell
  // We shift the draw position so the bigger image is centered over the snake's cell
  let offset = (headSize - cellSize) / 2;
  let headX = snake[0].x * cellSize - offset;
  let headY = snake[0].y * cellSize - offset;

  if (twilightLoaded) {
    if (facing === "left") {
      // Image is naturally facing left — draw normally
      ctx.drawImage(twilightImg, headX, headY, headSize, headSize);
    } else {
      // Flip to face right
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

  // Show the Game Over message
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

// ===== RUN THE GAME =====
startGame();
setInterval(function() {
  moveSnake();
  drawGame();
}, 100);