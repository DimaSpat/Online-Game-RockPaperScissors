const url = window.location.origin;
const socket = io.connect(url);

let turn = true;
let selected;
let symbol;
let otherPlayer;

const message = document.getElementById("message");
const buttons = document.querySelectorAll(".board button");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => makeMove(btn));
  btn.setAttribute("disabled", true);
});

function makeMove(btn) {
  if (!turn) return;
  if (btn.className == "selected");
  socket.emit("make.move", {
    symbol: symbol,
    position: btn.id,
  });
}

function renderTurnMessage() {
  if (turn) {
    message.innerHTML = "Results | other player: " + otherPlayer;
    buttons.forEach((btn) => btn.setAttribute("disabled", true));
  } else {
    message.innerHTML = "Your turn | other player: " + otherPlayer;
    buttons.forEach((btn) => btn.removeAttribute("disabled"));
  }
}

function isGameOver() {
  let state = getBoardState();
  let matches = [""];
  let rows = [];

  for (let i in rows) {
    if (rows[i] === matches[0] || rows[i] === matches[i]) return true;
  }
}

socket.on("game.begin", function (data) {
  symbol = data.symbol;
  otherPlayer = data.playerName;
  turn = symbol === "1";
  renderTurnMessage();
});

console.log(otherPlayer);

socket.on("move.made", function (data) {
  document.getElementById(data.position).innerHTML = data.symbol;
  turn = data.symbol !== symbol;
  if (!isGameOver()) {
    renderTurnMessage();
  } else {
    if (turn) message.innerHTML = "You lost.";
    else message.innerHTML = "You won!";
    buttons.forEach((btn) => btn.setAttribute("disabled", true));
  }
});

socket.on("opponent.left", function () {
  message.innerHTML = `Your opponent ${otherPlayer} left the game.`;
  buttons.forEach((btn) => btn.setAttribute("disabled", true));
  otherPlayer = "";
});
