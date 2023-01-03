//player factory function
const Player = (name, marker) => {
    const getName = () => name;
    const getTurn = () => turn;
    const getMarker = () => marker;

    return { getName, getTurn, getMarker };
};

//game board module
const gameBoard = (() => {
    const gameBoard = document.querySelector(".game-board");
    // let squaresClicked = 0;
    const getSquares = () => Array.from(document.querySelectorAll(".square"));
    let currentBoardState = null;
    let squaresArray = null;
    let unoccupiedSquaresIndexes = null;

    function getUnoccupiedSquareIndexes(currentBoardState) {
        return currentBoardState.filter(i => i != "X" && i != "O");
    }

    const updateCurrentBoardStatus = (index, marker) => {
        currentBoardState.splice(index, 1, marker);
    }

    const newGame = () => {
        currentBoardState = [1, 2, 3, 4, 5, 6, 7, 8];
        unoccupiedSquaresIndexes = [1, 2, 3, 4, 5, 6, 7, 8];
        displayController.playerPointer = 0;
        gameBoard.textContent = "";
        displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);
        let winnerName = null;

        //loop tp create all squares
        for (let i = 0; i < 9; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.addEventListener("click", onClick);
            square.textContent = "";
            gameBoard.appendChild(square)
        }
        squaresArray = getSquares();
    }

    const onClick = (e) => {
        if (e.target.textContent === "") {
            // console.log(displayController.playerArray
            // [displayController.playerPointer].getMarker())
            e.target.textContent = displayController.playerArray
            [displayController.playerPointer].getMarker();

            //updates the "data-marker" attribute to the marker value
            // e.target.dataset.marker = displayController.playerArray
            // [displayController.playerPointer].getMarker();
            //updates the "data-player-name" attribute to the player name value
            e.target.dataset.playerName = displayController.playerArray
            [displayController.playerPointer].getName();

            // console.log(squaresArray)
            updateCurrentBoardStatus(squaresArray.indexOf(e.target), displayController.playerArray[displayController.playerPointer].getMarker());

            unoccupiedSquaresIndexes = getUnoccupiedSquareIndexes(currentBoardState);

            console.log(displayController.playerArray[displayController.playerPointer].getMarker())
            if (checkWinningPatternFor(displayController.playerArray
            [displayController.playerPointer].getMarker())) {
                return;
            }
            console.log("out")
            changePlayer(displayController.playerPointer);

            //updates the turn text to match the turn of next player
            displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);
            console.log("lol")
        }
    }

    const changePlayer = (playerPointer) => {
        displayController.playerPointer = (playerPointer === 0) ? 1 : 0;
    }

    const checkWinningPatternFor = (currentMarker) => {
        if (horizontalWinPatternExists(currentMarker, squaresArray, displayController.playerArray)) return true;

        if (vericalWinPatternExists(currentMarker, squaresArray, displayController.playerArray)) return true;

        if (diagonalWinPatternExists(currentMarker, squaresArray, displayController.playerArray)) return true;

        if (drawPatternExists()) {
            declareWinner(null);
            return true;
        }
    }

    //checks the horizontal winning conditon for a player
    const horizontalWinPatternExists = (currentMarker, squaresArray, playerArray) => {
        console.log(squaresArray.length)
        let i = 0;
        while (i < 9) {
            if (squaresArray[i].textContent === squaresArray[i + 1].textContent && squaresArray[i + 1].textContent === squaresArray[i + 2].textContent && squaresArray[i].textContent !== "" && squaresArray[i].textContent === currentMarker) {
                for (let player of playerArray) {
                    //checks which marker value wins and matches it to the corresponding player
                    if (player.getMarker() === currentMarker) {
                        squaresArray[i].classList.add("win-squares");
                        squaresArray[i + 1].classList.add("win-squares");
                        squaresArray[i + 2].classList.add("win-squares");
                        declareWinner(player);
                    }
                }
                return true;
            }
            i = i + 3;
        }
    }

    //checks the vertical winning conditon for a player
    const vericalWinPatternExists = (currentMarker, squaresArray, playerArray) => {
        let j = 0;
        while (j < 3) {
            if (squaresArray[j].textContent === squaresArray[j + 3].textContent && squaresArray[j + 3].textContent === squaresArray[j + 6].textContent && squaresArray[j].textContent !== "" && squaresArray[j].textContent === currentMarker) {
                for (let player of playerArray) {
                    if (player.getMarker() === currentMarker) {
                        squaresArray[j].classList.add("win-squares");
                        squaresArray[j + 3].classList.add("win-squares");
                        squaresArray[j + 6].classList.add("win-squares");
                        declareWinner(player);
                    }
                };
                return true;
            }
            j++;
        }
    }

    //checks the diagonal winning conditon for a player
    const diagonalWinPatternExists = (currentMarker, squaresArray, playersArray) => {
        let k = 0;
        while (k < 3) {
            if (k === 0) {
                if (squaresArray[k].textContent === squaresArray[k + 4].textContent && squaresArray[k + 4].textContent === squaresArray[k + 8].textContent && squaresArray[k].textContent !== "" && squaresArray[k].textContent === currentMarker) {
                    for (let player of playersArray) {
                        if (player.getMarker() === currentMarker) {

                            squaresArray[k].classList.add("win-squares");
                            squaresArray[k + 4].classList.add("win-squares");
                            squaresArray[k + 8].classList.add("win-squares");
                            declareWinner(player);
                        }
                    }
                    return true;
                }
            }

            else {
                if (squaresArray[k].textContent === squaresArray[k + 2].textContent && squaresArray[k + 2].textContent === squaresArray[k + 4].textContent && squaresArray[k].textContent !== undefined && squaresArray[k].textContent === currentMarker) {
                    for (let player of displayController.playerArray) {
                        if (player.getMarker() === currentMarker) {

                            squaresArray[k].classList.add("win-squares");
                            squaresArray[k + 2].classList.add("win-squares");
                            squaresArray[k + 4].classList.add("win-squares");
                            declareWinner(player);
                        }
                    }
                    return true;
                }
            }
            k += 2;
        }
    }

    const drawPatternExists = () => {
        if (unoccupiedSquaresIndexes.length === 0) {
            return true;
        }
    }

    const declareWinner = (player) => {
        console.log(player)
        if (player) {
            displayController.updateWinnerName(player.getName());
        }
        else displayController.updateWinnerName("Game Draw!");
        displayController.playerPointer = 0;
        for (let square of squaresArray) {
            square.removeEventListener("click", onClick);
        }
        numberOfSquaresClicked = 0;
        unoccupiedSquares = [];
    }

    return { newGame };
})();

//module for display controller
const displayController = (() => {
    const playerOne = Player("1", "X");
    const playerTwo = Player("2", "O");
    let playerPointer = 0;
    const playerArray = [playerOne, playerTwo];

    const restartButton = document.querySelector(".restart");
    restartButton.addEventListener("click", gameBoard.newGame.bind(gameBoard));
    const playerTurn = document.querySelector(".player-turn");

    const updateTurnText = (playerTurn, playerArray, playerPointer) => {
        playerTurn.textContent = "Player " + playerArray[playerPointer].getName() + ", your turn.";
    }

    const updateWinnerName = (name) => {
        name === "Game Draw!" ? playerTurn.textContent = name : playerTurn.textContent = "Player " + name + " Won!";
    }

    return {
        playerTurn, playerPointer, playerArray, updateTurnText, updateWinnerName
    }
})();

gameBoard.newGame();