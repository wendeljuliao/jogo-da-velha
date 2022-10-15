const board = document.querySelector("[data-game-board]");
const cellElements = document.querySelectorAll("[data-cell]");

const messageTextWinner = document.querySelector(
  "[messageWinner-text]"
);
const messageWinner = document.querySelector("[messageWinner]");

const restartButton = document.querySelector("[button-restart]");

let turn;
let internBoard;

const winningCombinations = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 4, 6],
  [2, 5, 8],
  [3, 4, 5],
  [6, 7, 8],
];

let scores = {
  'x': 1,
  'circle': -1,
  'tie': 0
}

let ai = "";
let human = "";

function startGame() {
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

  boardHover();
  messageWinner.classList.remove("show-winning-message");
};

function endGame(isDraw) {
  if (isDraw) {
    messageTextWinner.innerText = "Empate!!!";
  } else {
    messageTextWinner.innerText = turn == "circle"
      ? "O venceu!!!"
      : "X Venceu!!!";
  }

  messageWinner.classList.add("show-winning-message");
};

function checkForWin(currentPlayer) {
  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentPlayer);
    });
  });
};

function checkForDraw() {
  return [...cellElements].every((cell) => {
    return cell.classList.contains("x") || cell.classList.contains("circle");
  });
};

function markCell(cell, classToAdd) {
  cell.classList.add(classToAdd);
};

function boardHover() {
  board.classList.remove("x");
  board.classList.remove("circle");

  if (turn == ia) {
    bestMove()
  } else {
    board.classList.add(human);
  }
};

function changeTurn() {
  if (turn == ia) {
    turn = human;
  } else {
    turn = ia;
  }

  boardHover();
};

function equalsCombination(a, b, c) {
  return a == b && b == c && a != "";
}

function verifyWinner() {
  let winner = null;

  // verificar horizontal
  for (let i = 0; i < 3; i++) {
    if (equalsCombination(internBoard[i][0], internBoard[i][1], internBoard[i][2])) {
      winner = internBoard[i][0];
    }
  }

  // verificar vertical
  for (let i = 0; i < 3; i++) {
    if (equalsCombination(internBoard[0][i], internBoard[1][i], internBoard[2][i])) {
      winner = internBoard[0][i];
    }
  }

  // verificar diagonal
  if (equalsCombination(internBoard[2][0], internBoard[1][1], internBoard[0][2])) {
    winner = internBoard[2][0];
  }

  if (equalsCombination(internBoard[0][0], internBoard[1][1], internBoard[2][2])) {
    winner = internBoard[0][0];
  }

  let openPoints = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (internBoard[i][j] == "") {
        openPoints++;
      }
    }
  }

  if (winner == null && openPoints == 0) {
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
          let score = minimaxPodaAlphaBeta(internBoard, 0, -Infinity, + Infinity, true);
          internBoard[i][j] = "";
          if (score < bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    let findCell = findCellInGameForBot(move);
    markCell(findCell, ia);
    atualizeInternBoard();
    stateGame(ia);
  } else {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (internBoard[i][j] == "") {
          internBoard[i][j] = ia;
          let score = minimaxPodaAlphaBeta(internBoard, 0, -Infinity, + Infinity, false);
          internBoard[i][j] = "";
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    let findCell = findCellInGameForBot(move);
    markCell(findCell, ia);
    atualizeInternBoard();
    stateGame(ia);
  }
}

function minimaxPodaAlphaBeta(internBoard, depth, alpha, beta, isMaximizing) {
  let result = verifyWinner();

  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (internBoard[i][j] == "") {
          internBoard[i][j] = "x";
          let score = minimaxPodaAlphaBeta(internBoard, depth + 1, alpha, beta, false);
          internBoard[i][j] = "";

          bestScore = Math.max(score, bestScore);
          alpha = Math.max(alpha, score);

          if (beta <= alpha) {
            break;
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
          let score = minimaxPodaAlphaBeta(internBoard, depth + 1, alpha, beta, true);
          internBoard[i][j] = "";

          bestScore = Math.min(score, bestScore);
          beta = Math.min(beta, score);

          if (beta <= alpha) {
            break;
          }
        }
      }
    }
    return bestScore;
  }

}


function stateGame(classToAdd) {
  const isWin = checkForWin(classToAdd);
  const isDraw = checkForDraw();

  if (isWin) {
    endGame(false);
  } else if (isDraw) {
    endGame(true);
  } else {
    changeTurn();
  };
}


function handleClick(e) {
  // Colocar a marca (X ou Círculo)
  const classToAdd = human;
  const cell = e.target;

  if (!cell.classList.contains("circle") && !cell.classList.contains("x")) {

    if (ia != turn) {
      markCell(cell, classToAdd);
      atualizeInternBoard();
    }

    stateGame(classToAdd);
  }
};

startGame();

restartButton.addEventListener("click", startGame);