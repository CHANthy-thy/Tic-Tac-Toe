// Get elements
const cells = document.querySelectorAll('.cell');
const levelSelect = document.getElementById('level');
const resetBtn = document.getElementById('reset');
const adminInfo = document.getElementById('admin-info');
const gameArea = document.getElementById('game-area');

// Game variables
let board = Array(9).fill('');
let player = 'X';
let ai = 'O';

// Winning combinations
function checkWin(b, symbol) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(w => w.every(i => b[i] === symbol));
}

// Minimax for hard level
function minimax(newBoard, playerSymbol) {
  const availSpots = newBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);

  if (checkWin(newBoard, player)) return {score: -10};
  else if (checkWin(newBoard, ai)) return {score: 10};
  else if (availSpots.length === 0) return {score: 0};

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = playerSymbol;

    if (playerSymbol === ai) {
      const result = minimax(newBoard, player);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, ai);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = '';
    moves.push(move);
  }

  let bestMove;
  if (playerSymbol === ai) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }

  return bestMove;
}

// AI move
function aiMove() {
  const level = levelSelect.value;
  let move;

  if (level === 'easy') {
    const empty = board.map((v,i) => v === '' ? i : null).filter(v => v !== null);
    move = empty[Math.floor(Math.random() * empty.length)];
  } 
  else if (level === 'medium') {
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = ai;
        if (checkWin(board, ai)) { move = i; board[i] = ''; break; }
        board[i] = '';
      }
    }
    // Try to block
    if (move === undefined) {
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = player;
          if (checkWin(board, player)) { move = i; board[i] = ''; break; }
          board[i] = '';
        }
      }
    }
    // Random
    if (move === undefined) { 
      const empty = board.map((v,i) => v === '' ? i : null).filter(v => v !== null);
      move = empty[Math.floor(Math.random() * empty.length)];
    }
  } 
  else if (level === 'hard') {
    move = minimax(board, ai).index;
  }

  board[move] = ai;
  cells[move].textContent = ai;

  if (checkWin(board, ai)) { 
    setTimeout(() => alert("AI Wins!"), 10); 
  } else if (!board.includes('')) {
    setTimeout(() => alert("Draw!"), 10);
  }
}

// Player clicks
cells.forEach((cell, idx) => {
  cell.addEventListener('click', () => {
    if (board[idx] === '') {
      board[idx] = player;
      cell.textContent = player;

      if (checkWin(board, player)) { 
        setTimeout(() => alert("You Win!"), 10);
        return;
      } else if (!board.includes('')) {
        setTimeout(() => alert("Draw!"), 10);
        return;
      }

      aiMove();
    }
  });
});

// ✅ Reset button working
resetBtn.addEventListener('click', () => {
  board = Array(9).fill('');
  cells.forEach(cell => cell.textContent = '');
  player = 'X';
});

// ✅ Level change (Admin mode toggle)
levelSelect.addEventListener('change', function() {
  if (this.value === 'admin') {
    adminInfo.style.display = 'block';
    gameArea.style.display = 'none';
  } else {
    adminInfo.style.display = 'none';
    gameArea.style.display = 'block';
  }
});
