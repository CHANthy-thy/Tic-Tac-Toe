const menu = document.getElementById("menu");
const gameArea = document.getElementById("game-area");
const adminInfo = document.getElementById("admin-info");
const board = document.querySelector(".board");
const result = document.getElementById("result");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const backBtn = document.getElementById("back");

let playMode = "ai";
let gameType = "classic";
let level = "easy";
let gameActive = false;
let currentPlayer = "X";
let boardState = [];

// Create the board dynamically
function createBoard(size) {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  boardState = new Array(size * size).fill("");

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.style.border = "1px solid #007bff";
    cell.style.borderRadius = "6px";
    cell.style.height = "60px";
    cell.style.display = "flex";
    cell.style.alignItems = "center";
    cell.style.justifyContent = "center";
    cell.style.fontSize = "2rem";
    cell.style.cursor = "pointer";
    cell.dataset.index = i;

    cell.addEventListener("click", () => {
      if (!gameActive || boardState[i] !== "") return;

      boardState[i] = currentPlayer;
      cell.textContent = currentPlayer;

      if (checkWin()) {
        gameActive = false;
        result.textContent = `${currentPlayer} Wins!`;
        return;
      } else if (boardState.every(cell => cell !== "")) {
        gameActive = false;
        result.textContent = "It's a Draw!";
        return;
      }

      currentPlayer = currentPlayer === "X" ? "O" : "X";

      if (playMode === "ai" && currentPlayer === "O" && gameActive) {
        aiMove();
      }
    });

    board.appendChild(cell);
  }
}

// Simple AI Move for demo purposes (random move)
function aiMove() {
  let availableIndices = [];
  boardState.forEach((val, idx) => {
    if (val === "") availableIndices.push(idx);
  });

  if (availableIndices.length === 0) return;

  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  boardState[randomIndex] = currentPlayer;

  const cell = board.querySelector(`[data-index="${randomIndex}"]`);
  if (cell) cell.textContent = currentPlayer;

  if (checkWin()) {
    gameActive = false;
    result.textContent = `${currentPlayer} Wins!`;
  } else if (boardState.every(cell => cell !== "")) {
    gameActive = false;
    result.textContent = "It's a Draw!";
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function checkWin() {
  const size = gameType === "classic" ? 3 : 4;
  const lines = [];

  // Rows and columns
  for (let i = 0; i < size; i++) {
    lines.push([...Array(size).keys()].map(j => i * size + j)); // rows
    lines.push([...Array(size).keys()].map(j => j * size + i)); // columns
  }

  // Diagonals
  lines.push([...Array(size).keys()].map(i => i * (size + 1)));
  lines.push([...Array(size).keys()].map(i => (i + 1) * (size - 1)));

  for (const line of lines) {
    const [first, ...rest] = line;
    if (
      boardState[first] !== "" &&
      rest.every(idx => boardState[idx] === boardState[first])
    ) {
      return true;
    }
  }

  return false;
}

startBtn.addEventListener("click", () => {
  playMode = document.getElementById("play-mode").value;
  gameType = document.getElementById("game-type").value;
  level = document.getElementById("level").value;

  // Hide menu
  menu.style.display = "none";

  // --- ADMIN PAGE MODE ---
  if (level === "admin") {
    // Show only admin info
    document.body.classList.add("admin-mode");
    gameArea.style.display = "block";
    adminInfo.style.display = "flex";
    adminInfo.style.flexDirection = "column";
    adminInfo.style.alignItems = "center";
    adminInfo.style.justifyContent = "center";
    adminInfo.style.textAlign = "center";

    // Completely hide game elements
    board.style.display = "none";
    result.style.display = "none";
    resetBtn.style.display = "none";
    backBtn.style.display = "none";

    // Clear the board if it was created before
    board.innerHTML = "";

    return; // stop here — don’t load the game
  }

  // --- NORMAL GAME MODE ---
  document.body.classList.remove("admin-mode");
  adminInfo.style.display = "none";
  board.style.display = "grid";
  result.style.display = "block";
  resetBtn.style.display = "inline-block";
  backBtn.style.display = "inline-block";

  const size = gameType === "classic" ? 3 : 4;
  createBoard(size);
  gameActive = true;
  currentPlayer = "X";
  result.textContent = "";
  gameArea.style.display = "block";
});

resetBtn.addEventListener("click", () => {
  const size = gameType === "classic" ? 3 : 4;
  createBoard(size);
  gameActive = true;
  currentPlayer = "X";
  result.textContent = "";
});

backBtn.addEventListener("click", () => {
  menu.style.display = "block";
  gameArea.style.display = "none";
  adminInfo.style.display = "none";
  document.body.classList.remove("admin-mode");
});
