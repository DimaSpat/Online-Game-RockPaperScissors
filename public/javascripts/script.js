const url = window.location.origin;
const socket = io.connect(url);

// const gameController = require("../../controllers/game-controller");

const initial = document.getElementById("initial");
const gamePlay = document.getElementById("gamePlay");
const waitingArea = document.getElementById("waitingArea");
const gameArea = document.getElementById("gameArea");
const roundsArea = document.getElementById("roundsArea");
const winnerArea = document.getElementById("winnerArea");
const back = document.getElementById("back");

let roomUniqueId;
let player1 = false;
let gameEnd = false;
let isRoundWinner = false;
let isGameWinner = false;
let roundsWon = 0;
let rounds = 3;
let login;

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

function showWaitingRoom() {
  initial.style.display = "none";
  const waitingRoom = document.createElement("div");
  waitingRoom.id = "waitingRoom";
  waitingRoom.innerHTML = `
    <h2>Waiting for an opponent...</h2>
    <p>Time elapsed: <span id="waitingTime">0 seconds</span></p>
    <button id="cancelWaiting">Cancel</button>
  `;
  document.body.appendChild(waitingRoom);

  let waitingTime = 0;
  const waitingTimeInterval = setInterval(() => {
    waitingTime++;
    document.getElementById(
      "waitingTime"
    ).textContent = `${waitingTime} seconds`;
  }, 1000);

  socket.on("opponentFound", () => {
    clearInterval(waitingTimeInterval);
    waitingTime = 0;
    document.body.removeChild(waitingRoom);
    initial.style.display = "none";
  });

  socket.on("newGame", (data) => {
    clearInterval(waitingTimeInterval);
    waitingTime = 0;
    document.body.removeChild(waitingRoom);
    initial.style.display = "none";
  });

  document.getElementById("cancelWaiting").addEventListener("click", () => {
    socket.emit("cancelWaiting");
    clearInterval(waitingTimeInterval);
    waitingTime = 0;
    document.body.removeChild(waitingRoom);
    initial.style.display = "block";
  });
}

socket.on("savingInitStats", (data) => {
  login = data.login;
});

socket.on("waitingForOpponent", () => {
  showWaitingRoom();
});

socket.on("playerDisconnected", (data) => {
  console.log("player disconnected: ", data.id);
});

socket.on("kickOnDisconnect", () => {
  initial.style.display = "block";
  gamePlay.style.display = "none";
  gameArea.style.display = "none";
  roundsArea.style.display = "none";
  back.style.display = "none";
  waitingArea.style.display = "none";
});

socket.on("newGame", (data) => {
  roomUniqueId = data.roomUniqueId;
  console.log(roomUniqueId);
  initial.style.display = "none";
  gamePlay.style.display = "block";
  gameArea.style.display = "none";
  winnerArea.style.display = "none";

  if (!player1) player1 = data.isFirstPlayer;

  let copyButton = document.createElement("button");
  copyButton.style.display = "block";
  copyButton.innerText = "Copy Code";
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(roomUniqueId);
  });
  waitingArea.innerHTML = `Waiting for opponent, please share code ${roomUniqueId} to join by clicking the button below.`;
  waitingArea.appendChild(copyButton);
});

socket.on("nextRound", function () {
  initial.style.display = "none";
  waitingArea.style.display = "none";
  gameArea.style.display = "block";
  gamePlay.style.display = "block";
  roundsArea.innerHTML = `<p>Rounds left: ${rounds}</p>`;
  roundsArea.style.display = "block";
  player1Choice.innerHTML = `
    <button onclick="sendChoice('Rock')">Rock</button>  
    <button onclick="sendChoice('Paper')">Paper</button>
    <button onclick="sendChoice('Scissors')">Scissors</button>
  `;
  player2Choice.innerHTML = `<p id="opponentState">Waiting for Opponent...</p>`;
  player1Choice.style.display = "block";
  player2Choice.style.display = "block";
});

socket.on("gamePlayAgain", function () {
  gameEnd = false;
  isRoundWinner = false;
  isGameWinner = false;
  roundsWon = 0;
  rounds = 3;

  initial.style.display = "none";
  waitingArea.style.display = "none";
  gameArea.style.display = "block";
  gamePlay.style.display = "block";
  roundsArea.innerHTML = `<p>Rounds left: ${rounds}</p>`;
  roundsArea.style.display = "block";
  player1Choice.innerHTML = `
    <button onclick="sendChoice('Rock')">Rock</button>  
    <button onclick="sendChoice('Paper')">Paper</button>
    <button onclick="sendChoice('Scissors')">Scissors</button>
  `;
  player2Choice.innerHTML = `<p id="opponentState">Waiting for Opponent...</p>`;
  player1Choice.style.display = "block";
  player2Choice.style.display = "block";
  winnerArea.style.display = "none";
  winnerArea.innerHTML = `<p>History:</p>`;
  back.style.display = "none";
  back.innerHTML = ``;
})

socket.on("playersConnected", () => {
  initial.style.display = "none";
  waitingArea.style.display = "none";
  gameArea.style.display = "block";
  gamePlay.style.display = "block";
  roundsArea.innerHTML = `<p>Rounds left: ${rounds}</p>`;
  roundsArea.style.display = "block";
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
  winnerArea.style.display = "block";

  if (data.winner != "draw") {
    if (data.winner == "player 1" && player1) {
      winnerText = "You win";
      isRoundWinner = true;
    } else if (data.winner == "player 1") {
      winnerText = "You lose";
    }
    if (data.winner == "player 2" && !player1) {
      winnerText = "You win";
      isRoundWinner = true;
    } else if (data.winner == "player 2") {
      winnerText = "You lose";
    }
  } else {
    winnerText = "It's a draw";
  }

  let area = document.createElement("p");
  area.innerText = winnerText;
  winnerArea.appendChild(area);

  document.getElementById("opponentButton").style.display = "block";

  rounds--;
  roundsArea.innerHTML = `<p>Rounds left: ${rounds}</p>`;

  let leftTime = 0;
  let totalTimeS = 3;

  if (rounds > 0) {
    roundsArea.innerHTML = `<p>Rounds left: ${rounds} | Time until next round: ${
      totalTimeS - leftTime
    }</p>`;
  } else {
    roundsArea.innerHTML = `<p>Rounds left: ${rounds} | Time until game results: ${
      totalTimeS - leftTime
    }</p>`;
  }

  let interval = setInterval(() => {
    leftTime++;
    if (rounds > 0) {
      roundsArea.innerHTML = `<p>Rounds left: ${rounds} | Time until next round: ${
        totalTimeS - leftTime
      }</p>`;
    } else {
      roundsArea.innerHTML = `<p>Rounds left: ${rounds} | Time until game results: ${
        totalTimeS - leftTime
      }</p>`;
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(interval);

    if (rounds > 0) {
      if (isRoundWinner) {
        roundsWon++;
        isRoundWinner = false;
      }
      socket.emit("roundOver", { roomUniqueId: roomUniqueId });
    } else {
      roundsArea.style.display = "none";
      if (roundsWon > rounds / 2) {
        winnerText = "You win the game with a score of " + roundsWon;
        isGameWinner = true;
      } else if (roundsWon == Math.floor(rounds / 2 - 0.49)) {
        winnerText = "You tied the game with a score of " + roundsWon;
      } else {
        winnerText = "You lose the game with a score of " + roundsWon;
      }
      gameEnd = true;
      back.style.display = "block";
      let gameValues = document.createElement("p");
      gameValues.innerText = winnerText;
      winnerArea.appendChild(gameValues);
      socket.emit("gameOver", {
        roomUniqueId: roomUniqueId,
        login: login,
        isWinner: isGameWinner,
        gameEnd: gameEnd,
        roundsWon: roundsWon
      });
      gameEnd = false;
      isGameWinner = false;
      back.innerHTML = `
        <button id="playAgainButton">Play Again</button>
        <button id="cancelAgainButton">Cancel</button>
      `;
      document
        .getElementById("playAgainButton")
        .addEventListener("click", () => {
          socket.emit("playAgain", {
            roomUniqueId: roomUniqueId,
            playAgain: true,
          });
          document.getElementById("cancelAgainButton").style.display = "none";
          document.getElementById("cancelAgainButton").disabled = true;
        });
      document
        .getElementById("cancelAgainButton")
        .addEventListener("click", () => {
          console.log(player1);
          socket.emit("playAgain", {
            roomUniqueId: roomUniqueId,
            playAgain: false,
          });
          document.getElementById("playAgainButton").style.display = "none";
          document.getElementById("playAgainButton").disabled = true;
        });

      socket.on("getBack", () => {
        back.innerHTML = `<p><a href="/game">Get back</a> to play an other game or <a href="/">go to main page</a></p>`;
      });
    }
  }, totalTimeS * 1000);
});

function sendChoice(choice) {
  const choiceEvent = player1 ? "p1Choice" : "p2Choice";
  socket.emit(choiceEvent, {
    rpsValue: choice,
    roomUniqueId: roomUniqueId,
  });

  let player1Choice = document.getElementById("player1Choice");

  player1Choice.innerHTML = "";

  let playerChoiceButton = document.createElement("button");
  playerChoiceButton.style.display = "block";
  playerChoiceButton.innerText = choice;

  player1Choice.appendChild(playerChoiceButton);
}

function createOpponentChoiceButton(data) {
  const player2Choice = document.getElementById("player2Choice");
  let opponentButton = document.createElement("button");
  player2Choice.innerHTML = "";
  opponentButton.id = "opponentButton";
  opponentButton.style.display = "none";
  opponentButton.innerText = data.rpsValue;
  player2Choice.appendChild(opponentButton);
}
