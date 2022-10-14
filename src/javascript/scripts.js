const cellElements = document.querySelectorAll("[data-cell]");
const board = document.querySelector("[data-board]");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
const winningMessage = document.querySelector("[data-winning-message]");
const restartButton = document.querySelector("[data-restart-button]");

let turn;
let internBoard;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let scores = {
  'x': 1,
  'circle': -1,
  'tie': 0
}

let ai = "";
let human = "";

const startGame = () => {
  internBoard = [["", "", ""], ["", "", ""], ["", "", ""]];

  ia = Math.floor(Math.random() * 2) == 0 ? "x" : "circle";
  human = ia != "x" ? "x" : "circle";

  turn = "x";

  for (const cell of cellElements) {
    cell.classList.remove("circle");
    cell.classList.remove("x");
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  }

  setBoardHoverClass();
  winningMessage.classList.remove("show-winning-message");
};

const endGame = (isDraw) => {
  if (isDraw) {
    winningMessageTextElement.innerText = "Empate!";
  } else {
    winningMessageTextElement.innerText = turn == "circle"
      ? "O Venceu!"
      : "X Venceu!";
  }

  winningMessage.classList.add("show-winning-message");
};

const checkForWin = (currentPlayer) => {
  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentPlayer);
    });
  });
};

const checkForDraw = () => {
  return [...cellElements].every((cell) => {
    return cell.classList.contains("x") || cell.classList.contains("circle");
  });
};

const placeMark = (cell, classToAdd) => {
  cell.classList.add(classToAdd);
};

const setBoardHoverClass = () => {
  board.classList.remove("circle");
  board.classList.remove("x");

  if (turn == ia) {
    bestMove()
  } else {

    board.classList.add(human);

  }
};

const swapTurns = () => {
  if (turn == ia) {
    turn = human;
  } else {
    turn = ia;
  }

  setBoardHoverClass();
};

function equals3(a, b, c) {
  return a == b && b == c && a != "";

}

function checkWinner() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(internBoard[i][0], internBoard[i][1], internBoard[i][2])) {
      winner = internBoard[i][0];
    }
  }

  // vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(internBoard[0][i], internBoard[1][i], internBoard[2][i])) {
      winner = internBoard[0][i];
    }
  }

  // diagonal
  if (equals3(internBoard[0][0], internBoard[1][1], internBoard[2][2])) {
    winner = internBoard[0][0];
  }
  if (equals3(internBoard[2][0], internBoard[1][1], internBoard[0][2])) {
    winner = internBoard[2][0];
  }

  let openSpots = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (internBoard[i][j] == "") {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return "tie";
  } else {
    return winner;
  }
}

function findCellInGameForBot(move) {
  let indice = Math.floor(move.i * 3 + move.j);
  return cellElements[indice];
}

function atualizeInternBoard() {
  let x = 0;
  let y = 0;

  let classIndice = 0;
  for (const cell of cellElements) {
    classIndice = cell.className.split(" ")[1];

    x = Math.floor(classIndice / 3);
    y = Math.floor(classIndice % 3);

    if (cell.classList.contains("x")) {
      internBoard[x][y] = "x";
    }

    if (cell.classList.contains("circle")) {
      internBoard[x][y] = "circle";
    }

  }
}

function bestMove() {

  if (ia == "circle") {
    let bestScore = Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (internBoard[i][j] == "") {
          internBoard[i][j] = ia;
          let score = minimax(internBoard, 0, true);
          internBoard[i][j] = "";
          if (score < bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    let findCell = findCellInGameForBot(move);
    placeMark(findCell, ia);
    atualizeInternBoard();
    stateGame(ia);
  } else {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (internBoard[i][j] == "") {
          internBoard[i][j] = ia;
          let score = minimax(internBoard, 0, false);
          internBoard[i][j] = "";
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    let findCell = findCellInGameForBot(move);
    placeMark(findCell, ia);
    atualizeInternBoard();
    stateGame(ia);
  }
}

function minimax(internBoard, depth, isMaximizing) {
  let result = checkWinner();

  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (internBoard[i][j] == "") {
          internBoard[i][j] = "x";
          let score = minimax(internBoard, depth + 1, false);
          internBoard[i][j] = "";

          if (score > bestScore) {
            bestScore = score;
          }
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (internBoard[i][j] == "") {
          internBoard[i][j] = "circle";
          let score = minimax(internBoard, depth + 1, true);
          internBoard[i][j] = "";

          if (score < bestScore) {
            bestScore = score;
          }
        }
      }
    }
    return bestScore;
  }

}


const stateGame = (classToAdd) => {

  const isWin = checkForWin(classToAdd);

  const isDraw = checkForDraw();

  if (isWin) {
    endGame(false);
  } else if (isDraw) {
    endGame(true);
  } else {
    swapTurns();
  };
}


const handleClick = (e) => {
  // Colocar a marca (X ou Círculo)
  const classToAdd = human;
  const cell = e.target;

  if (!cell.classList.contains("circle") && !cell.classList.contains("x")) {

    if (ia != turn) {
      placeMark(cell, classToAdd);
      atualizeInternBoard();
    }

    stateGame(classToAdd);
  }
};

startGame();

restartButton.addEventListener("click", startGame);