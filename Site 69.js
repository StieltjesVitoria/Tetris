const board = document.getElementById("game-board");
const cellSize = 20;
const numRows = 20;
const numCols = 20;
let energy = 30;
let points = 0;
let record = 0;
let velocidade = 128;


const snake = [{ x: 10, y: 10 }];

let food = generateFoodPosition();
let direction = "down";

const directions = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right"
};

function generateFoodPosition() {
  const x = Math.floor(Math.random() * numCols);
  const y = Math.floor(Math.random() * numRows);
  return { x, y };
}

function draw() {

  board.innerHTML = "";

  const foodElement = document.createElement("div");
  foodElement.style.gridColumn = food.x + 1;
  foodElement.style.gridRow = food.y + 1;
  foodElement.classList.add("food");
  board.appendChild(foodElement);

  snake.forEach((segment, index) => {
    const snakeSegment = document.createElement("div");
    snakeSegment.style.gridColumn = segment.x + 1;
    snakeSegment.style.gridRow = segment.y + 1;
    snakeSegment.classList.add("snake");

    if (index === 0) {
      snakeSegment.classList.add("head");
    }
    board.appendChild(snakeSegment);
  });
}

function isDirectionValid(newDirection) {
  if (direction === "up" && newDirection === "down") {
    return false;
  }
  if (direction === "down" && newDirection === "up") {
    return false;
  }
  if (direction === "left" && newDirection === "right") {
    return false;
  }
  if (direction === "right" && newDirection === "left") {
    return false;
  }
  return true;
}

function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y -= 1;
      break;
    case "down":
      head.y += 1;
      break;
    case "left":
      head.x -= 1;
      break;
    case "right":
      head.x += 1;
      break;
  }

  snake.unshift(head);
  energy = energy - 1;
  document.getElementById('energia').innerHTML = `Energia: ${energy}`

  if (
    head.x < 0 ||
    head.x >= numCols ||
    head.y < 0 ||
    head.y >= numRows ||
    energy <= -1 ||
    snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    alert("Fim de jogo");
    resetGame();
    return;
  }



  if (head.x === food.x && head.y === food.y) {

    snake.push({});
    points = points + 1;
    energy = energy + 20;
    food = generateFoodPosition();
    document.getElementById('pontos').innerHTML = `Pontos: ${points}`;

  } else {

    snake.pop();
  }


  draw();


  setTimeout(move, velocidade);
}

function resetGame() {
  snake.length = 1;
  snake[0] = { x: 5, y: 5 };
  food = generateFoodPosition();
  record = points;
  points = 0;
  document.getElementById('pontos').innerHTML = `Pontos: ${points}`;
  document.getElementById('record').innerHTML = `Recorde: ${record}`;
  energy = 30;
  direction = "down";
  draw();
  move();
}

const body = document.body
body.addEventListener('keypress', tecla => {
  if (!isDirectionValid(directions[tecla.key])) return;
  direction = directions[tecla.key];
})


document.getElementById('energia').innerHTML = `Energia: ${energy}`;
document.getElementById('pontos').innerHTML = `Pontos: ${points}`;

move();