const url = window.location.origin;
const socket = io.connect(url);

// const gameController = require("../../controllers/game-controller");

const initial = document.getElementById("initial");
const gamePlay = document.getElementById("gamePlay");
const waitingArea = document.getElementById("waitingArea");
const gameArea = document.getElementById("gameArea");

let roomUniqueId;
let player1 = false;
let gameEnd = false;
let isWinner = false;

function createGame() {
  player1 = true;
  socket.emit("createGame");
}

function joinGame() {
  roomUniqueId = document.getElementById("roomUniqueId").value;
  socket.emit("joinGame", { roomUniqueId: roomUniqueId });
}

function onlineGame() {
  socket.emit("onlineGame");
}

socket.on("newGame", (data) => {
  roomUniqueId = data.roomUniqueId;
  initial.style.display = "none";
  gamePlay.style.display = "block";

  let copyButton = document.createElement("button");
  copyButton.style.display = "block";
  copyButton.innerText = "Copy Code";
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(roomUniqueId);
  });

  waitingArea.innerHTML = `Waiting for opponent, please share code ${roomUniqueId} to join`;
  waitingArea.appendChild(copyButton);
});

socket.on("playersConnected", () => {
  waitingArea.style.display = "none";
  gameArea.style.display = "block";
});

socket.on("p1Choice", function (data) {
  if (!player1) {
    createOpponentChoiceButton(data);
  }
});

socket.on("p2Choice", function (data) {
  if (player1) {
    createOpponentChoiceButton(data);
  }
});

socket.on("result", function (data) {
  let winnerText = "";

  if (data.winner != "draw") {
    if (data.winner == "player 1" && player1) {
      winnerText = "You win";
      isWinner = true;
    } else if (data.winner == "player 1") {
      winnerText = "You lose";
    }
    if (data.winner == "player 2" && !player1) {
      winnerText = "You win";
      isWinner = true;
    } else if (data.winner == "player 2") {
      winnerText = "You lose";
    }
  } else {
    winnerText = "It's a draw";
  }

  document.getElementById("opponentButton").style.display = "block";
  document.getElementById("winnerArea").innerHTML = winnerText;
  document.getElementById("back").style.display = "block";
  gameEnd = true;

  // gameController.updatingUser();
});

function sendChoice(choice) {
  const choiceEvent = player1 ? "piChoice" : "p2Choice";
  socket.emit(choiceEvent, {
    rpsValue: choice,
    roomUniqueId: roomUniqueId,
  });

  let player1Choice = document.getElementById("player1Choice");

  player1Choice.innerHTML = "";

  let playerChoiceButton = document.createElement("button");
  playerChoiceButton.style.accentColor.display = "block";
  playerChoiceButton.innerText = choice;

  player1Choice.appendChild(playerChoiceButton);
}

function createOpponentChoiceButton(data) {
  const player2Choice = document.getElementById("player2Choice");
  player2Choice.innerHTML = "";
  let opponentButton = document.createElement("button");
  opponentButton.id = "opponentButton";
  opponentButton.style.display = "none";
  opponentButton.innerText = data.rpsValue;
  player2Choice.appendChild(opponentButton);
}

module.exports = { isWinner, gameEnd };