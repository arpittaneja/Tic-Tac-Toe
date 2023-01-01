//player factory function
const Player = (name, marker) => {
    const getName = () => name;
    const getTurn = () => turn;
    const getMarker = () => marker;
    return { getName, getTurn, getMarker };
};

//game board module
const gameBoard = (() => {
    const gameBoardContainer = document.querySelector(".game-board");
    const getSquares = () => Array.from(document.querySelectorAll(".square"));
    let currentBoardState = null;
    // let unoccupiedSquares = null;
    let squaresArray = null;
    let unoccupiedSquaresIndexes = null;

    function updateAllUnoccupiedSquareIndexes() {
        unoccupiedSquaresIndexes = currentBoardState.filter(i => i != "X" && i != "O");
    }

    const newGame = () => {
        displayController.playerPointer = 0;
        gameBoardContainer.textContent = "";
        displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

        //loop to create all squares
        for (let i = 0; i < 9; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.dataset.status = "unoccupied";
            square.addEventListener("click", onClick);
            gameBoardContainer.appendChild(square)
        }
        // unoccupiedSquares = getSquares();
        squaresArray = getSquares();
        unoccupiedSquaresIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        currentBoardState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    }

    const updateCurrentBoardStatus = (index, marker) => {
        currentBoardState.splice(index, 1, marker);
    }

    const onClick = (e) => {
        if (e.target.dataset.status !== "occupied") {
            e.target.textContent = displayController.playerArray
            [displayController.playerPointer].getMarker();

            e.target.dataset.status = "occupied";

            updateCurrentBoardStatus(squaresArray.indexOf(e.target), displayController.playerArray[displayController.playerPointer].getMarker());

            console.log(currentBoardState);

            updateAllUnoccupiedSquareIndexes();
            console.log(unoccupiedSquaresIndexes);

            if (gameEndPatternExists()) {
                return;
            }

            changePlayer(displayController.playerPointer);
            displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

            aiTurn();
        }
    }

    const changePlayer = (playerPointer) => {
        displayController.playerPointer = (playerPointer === 0) ? 1 : 0;
    }

    const aiTurn = () => {
        const bestPlayInfo = minimax(displayController.playerArray[displayController.playerPointer].getMarker());

        console.log(bestPlayInfo)
        squaresArray[bestPlayInfo.index].textContent = displayController.playerArray[displayController.playerPointer].getMarker();

        squaresArray[bestPlayInfo.index].dataset.status = "occupied";

        updateCurrentBoardStatus(squaresArray.indexOf(squaresArray[bestPlayInfo.index]), displayController.playerArray[displayController.playerPointer].getMarker());

        updateAllUnoccupiedSquareIndexes();

        if (gameEndPatternExists()) {
            return;
        }

        changePlayer(displayController.playerPointer);

        displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

        // unoccupiedSquares[0]
    }

    const minimax = (currentMarker) => {
        if (drawPatternExists()) {
            return { score: 0 };
        }
        else if (gameEndPatternExists()) {
            if (displayController.playerArray
            [displayController.playerPointer].getName() === "2") {
                return { score: 10 };
            } else return { score: -10 };
        }

        const allTestPlayInfos = [];

        for (let i = 0; i < unoccupiedSquaresIndexes.length; i++) {

            const currentTestPlayInfo = {};

            currentTestPlayInfo.index = currentBoardState[unoccupiedSquaresIndexes[i]];

            squaresArray[unoccupiedSquaresIndexes[i]].textContent = currentMarker;

            squaresArray[unoccupiedSquaresIndexes[i]].dataset.status = "occupied";

            updateCurrentBoardStatus(squaresArray.indexOf(squaresArray[unoccupiedSquaresIndexes[i]]), currentMarker);

            updateAllUnoccupiedSquareIndexes();

            // unoccupiedSquaresIndexes = getAllEmptySquareIndexes(currentBoardState);
            console.log()


            if (currentMarker === "X") {
                let result = minimax("O");
                currentTestPlayInfo.score = result.score;
            } else {
                let result = minimax("X");
                currentTestPlayInfo.score = result.score;
            }
            // unoccupiedSquares[i] = 
            squaresArray[unoccupiedSquaresIndexes[i]].textContent = "";

            squaresArray[unoccupiedSquaresIndexes[i]].dataset.status = "unoccupied";

            updateCurrentBoardStatus(squaresArray.indexOf(squaresArray[unoccupiedSquaresIndexes[i]]), squaresArray.indexOf(squaresArray[unoccupiedSquaresIndexes[i]]));

            updateAllUnoccupiedSquareIndexes();

            allTestPlayInfos.push(currentTestPlayInfo);
        }

        let bestTestPlay = null;

        if (currentMarker === "X") {
            let bestScore = -Infinity;
            for (let i = 0; i < allTestPlayInfos.length; i++) {
                if (allTestPlayInfos[i].score > bestScore) {
                    bestScore = allTestPlayInfos[i].score;
                    bestTestPlay = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < allTestPlayInfos.length; i++) {
                if (allTestPlayInfos[i].score < bestScore) {
                    bestScore = allTestPlayInfos[i].score;
                    bestTestPlay = i;
                }
            }
        }
        return allTestPlayInfos[bestTestPlay];
    }

    const gameEndPatternExists = () => {
        // let squares = getSquares();

        if (horizontalWinningPattern(squaresArray, displayController.playerArray)) return true;

        if (vericalWinningPatternExists(squaresArray, displayController.playerArray)) return true;

        if (diagonalWinningPatternExists(squaresArray, displayController.playerArray)) return true;

        if (drawPatternExists()) {
            declareWinner(null);
            return true;
        }
        return false;
    }

    //checks the horizontal winning conditon for a player
    const horizontalWinningPattern = (squaresArray, playerArray) => {
        let i = 0;
        while (i < 9) {
            if (squaresArray[i].textContent === squaresArray[i + 1].textContent && squaresArray[i + 1].textContent === squaresArray[i + 2].textContent && squaresArray[i].textContent !== "") {
                for (let player of playerArray) {
                    //checks which marker value wins and matches it to the corresponding player
                    if (player.getMarker() === squaresArray[i].textContent) {
                        declareWinner(player);

                        squaresArray[i].classList.add("win-squares");
                        squaresArray[i + 1].classList.add("win-squares");
                        squaresArray[i + 2].classList.add("win-squares");
                    }
                }
                return true;
            }
            i = i + 3;
        }
    }

    //checks the vertical winning conditon for a player
    const vericalWinningPatternExists = (squaresArray, playerArray) => {
        let j = 0;
        while (j < 3) {
            if (squaresArray[j].textContent === squaresArray[j + 3].textContent && squaresArray[j + 3].textContent === squaresArray[j + 6].textContent && squaresArray[j].textContent !== "") {
                for (let player of playerArray) {
                    if (player.getMarker() === squaresArray[j].textContent) {
                        declareWinner(player);
                        squaresArray[j].classList.add("win-squares");
                        squaresArray[j + 3].classList.add("win-squares");
                        squaresArray[j + 6].classList.add("win-squares");
                    }
                };
                return true;
            }
            j++;
        }
    }

    //checks the diagonal winning conditon for a player
    const diagonalWinningPatternExists = (squaresArray, playerArray) => {
        let k = 0;
        while (k < 3) {
            if (k === 0) {
                if (squaresArray[k].textContent === squaresArray[k + 4].textContent && squaresArray[k + 4].textContent === squaresArray[k + 8].textContent && squaresArray[k].textContent !== "") {
                    for (let player of playerArray) {
                        if (player.getMarker() === squaresArray[k].textContent) {

                            declareWinner(player);
                            squaresArray[k].classList.add("win-squares");
                            squaresArray[k + 4].classList.add("win-squares");
                            squaresArray[k + 8].classList.add("win-squares");

                        }
                    }
                    return true;
                }
            }

            else {
                if (squaresArray[k].textContent === squaresArray[k + 2].textContent && squaresArray[k + 2].textContent === squaresArray[k + 4].textContent && squaresArray[k].textContent !== "") {
                    for (let player of displayController.playerArray) {
                        if (player.getMarker() === squaresArray[k].textContent) {

                            declareWinner(player);
                            squaresArray[k].classList.add("win-squares");
                            squaresArray[k + 2].classList.add("win-squares");
                            squaresArray[k + 4].classList.add("win-squares");
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
        if (player) {
            displayController.updateWinnerName(player.getName());
        }
        else displayController.updateWinnerName("Game Draw!");
        displayController.playerPointer = 0;
        let squares = getSquares();
        for (let square of squares) {
            square.removeEventListener("click", onClick);
        }
        // numberOfSquaresClicked = 0;
        // unoccupiedSquares = [];
    }

    return { newGame };
})();

//module for display controller
const displayController = (() => {
    const playerOne = Player("1", "O");
    const playerTwo = Player("2", "X");
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