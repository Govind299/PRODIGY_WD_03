const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const gameScreen = document.getElementById("game-screen");
const menu = document.getElementById("menu");

let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];
let gameMode = "player";

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

cells.forEach(cell => cell.addEventListener("click", handleClick));

function startGame(mode) {
    gameMode = mode;
    menu.style.display = "none";
    gameScreen.style.display = "block";
    restartGame();
}

function goBack() {
    menu.style.display = "block";
    gameScreen.style.display = "none";
}

function handleClick(e) {
    const index = e.target.dataset.index;
    if (board[index] !== "" || !gameActive) return;

    makeMove(index, currentPlayer);
    if (checkWinner()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    } else if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    if (gameMode === "ai" && currentPlayer === "O" && gameActive) {
        setTimeout(aiMove, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
}

function aiMove() {
    let bestIndex = getRandomMove();
    makeMove(bestIndex, "O");

    if (checkWinner()) {
        statusText.textContent = "AI wins!";
        gameActive = false;
    } else if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
    } else {
        currentPlayer = "X";
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function getRandomMove() {
    const emptyIndexes = board
        .map((v, i) => v === "" ? i : null)
        .filter(i => i !== null);
    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
}

function checkWinner() {
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => (cell.textContent = ""));
}
