const url = window.location.origin;
const socket = io.connect(url);

let turn = true;
let selected;
let symbol;

const message = document.getElementById("message");
const buttons = document.querySelectorAll(".board button");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => makeMove(btn));
  btn.setAttribute("disabled", true);
});

function makeMove(btn) {
  if (!moveTurn) return;
  if (btn.className == "selected");
  socket.emit("make.move", {
    symbol: symbol,
    position: btn.id,
  });
}

function renderTurnMessage() {
  if (turn) {
    message.innerHTML = "Results";
    buttons.forEach((btn) => btn.setAttribute("disabled", true));
  } else {
    message.innerHTML = "Your turn";
    buttons.forEach((btn) => btn.removeAttribute("disabled"));
  }
}

function isGameOver() {
  let state = getBoardState();
  let matches = [""]
}

socket.on("game.begin", function (data) {
  symbol = data.symbol;
  turn = symbol ? true : false;
  renderTurnMessage();
});

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
  message.innerHTML = "Your opponrnt left the game.";
  buttons.forEach((btn) => btn.setAttribute("disabled", true));
});
