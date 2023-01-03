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
    let squaresArray = null;
    let unoccupiedSquaresIndexes = null;

    function getUnoccupiedSquareIndexes(currentBoardState) {
        return currentBoardState.filter(i => i != "X" && i != "O");
    }

    const updateCurrentBoardStatus = (index, marker) => {
        currentBoardState.splice(index, 1, marker);
    }

    const newGame = () => {
        displayController.playerPointer = 0;
        gameBoardContainer.textContent = "";
        displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

        //loop to create all squares
        for (let i = 0; i < 9; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            // if (i === 1 || i === 4 || i === 2 || i === 8) {
            square.dataset.status = "unoccupied";
            square.textContent = "";
            // }

            square.addEventListener("click", onClick);
            gameBoardContainer.appendChild(square)
        }
        // unoccupiedSquares = getSquares();
        squaresArray = getSquares();
        // unoccupiedSquaresIndexes = [1, 2, 4, 8];
        // currentBoardState = ["X", 1, 2, "X", 4, "X", "O", "O", 8];
        // for (let i = 0; i < 9; i++) {
        //     if (typeof currentBoardState[i] === "string") {
        //         squaresArray[i].textContent = currentBoardState[i];
        //     }
        // }

        currentBoardState = [1, 2, 3, 4, 5, 6, 7, 8]
        unoccupiedSquaresIndexes = [1, 2, 3, 4, 5, 6, 7, 8]
    }

    const onClick = (e) => {
        if (e.target.dataset.status !== "occupied") {
            e.target.textContent = displayController.playerArray
            [displayController.playerPointer].getMarker();

            e.target.dataset.status = "occupied";

            updateCurrentBoardStatus(squaresArray.indexOf(e.target), displayController.playerArray[displayController.playerPointer].getMarker());

            console.log(currentBoardState);

            unoccupiedSquaresIndexes = getUnoccupiedSquareIndexes(currentBoardState);

            console.log(unoccupiedSquaresIndexes);

            if (gameEndPatternExists(displayController.playerArray
            [displayController.playerPointer].getMarker())) {
                return;
            }

            changePlayer(displayController.playerPointer);
            displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

            console.log(displayController.playerArray[displayController.playerPointer].getMarker())
            aiTurn();
        }
    }

    const changePlayer = (playerPointer) => {
        displayController.playerPointer = (playerPointer === 0) ? 1 : 0;
    }

    const aiTurn = () => {
        console.log(displayController.playerArray[displayController.playerPointer].getMarker())

        const bestPlayInfo = minimax(null, currentBoardState, unoccupiedSquaresIndexes, displayController.playerArray[displayController.playerPointer].getMarker());

        
        console.log(bestPlayInfo)
        console.log(displayController.playerArray[displayController.playerPointer].getMarker())
        
        
        squaresArray[bestPlayInfo.index].textContent = displayController.playerArray[displayController.playerPointer].getMarker();
        
        squaresArray[bestPlayInfo.index].dataset.status = "occupied";
        
        updateCurrentBoardStatus(squaresArray.indexOf(squaresArray[bestPlayInfo.index]), displayController.playerArray[displayController.playerPointer].getMarker());
        console.log(currentBoardState);

        unoccupiedSquaresIndexes = getUnoccupiedSquareIndexes(currentBoardState);
        console.log(unoccupiedSquaresIndexes);
        
        changePlayer(displayController.playerPointer);

        displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);
        if (gameEndPatternExists(displayController.playerArray
            [displayController.playerPointer].getMarker())) {
                return;
        }

        changePlayer(displayController.playerPointer);

        displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

        // unoccupiedSquares[0]
    }

    const minimax = (savedIndex, currentBoardState, unoccupiedSquaresIndexes, currentMarker) => {
        console.log(currentMarker)
        console.log("currentBoardState", currentBoardState)
        console.log("unoccupiedSquaresIndexes", unoccupiedSquaresIndexes)

        if (gameEndPatternExists("O")) {
            console.log("result")
            return { score: -1 };
        } else if (gameEndPatternExists("X")) {
            console.log("result") 
            return { score: 1 }
        } else if (drawPatternExists()) {
            console.log("draw")
            return { score: 0 };
        }

        const allTestPlayInfos = [];

        for (let i = 0; i < unoccupiedSquaresIndexes.length; i++) {

            console.log("i=", i, currentMarker)
            const currentTestPlayInfo = {};

            currentTestPlayInfo.index = currentBoardState[unoccupiedSquaresIndexes[i]];

            squaresArray[unoccupiedSquaresIndexes[i]].textContent = currentMarker;

            squaresArray[unoccupiedSquaresIndexes[i]].dataset.status = "occupied";

            savedIndex = unoccupiedSquaresIndexes[i];
            console.log(savedIndex);

            console.log("marked marked and occupied")
            updateCurrentBoardStatus(squaresArray.indexOf(squaresArray[unoccupiedSquaresIndexes[i]]), currentMarker);
            console.log("currentBoardState", currentBoardState);

            unoccupiedSquaresIndexes = getUnoccupiedSquareIndexes(currentBoardState);
            console.log("unoccupiedSquaresIndexes", unoccupiedSquaresIndexes);

            if (currentMarker === "X") {
                let result = minimax(savedIndex, currentBoardState, unoccupiedSquaresIndexes, "O");
                currentTestPlayInfo.score = result.score;
                console.log(currentTestPlayInfo.score);
            } else {
                let result = minimax(savedIndex, currentBoardState, unoccupiedSquaresIndexes, "X");
                currentTestPlayInfo.score = result.score;
                console.log(currentTestPlayInfo.score);
            }

            console.log(currentMarker, "2nd")

            updateCurrentBoardStatus(savedIndex, savedIndex);
            console.log("currentBoardState", currentBoardState);

            unoccupiedSquaresIndexes = getUnoccupiedSquareIndexes(currentBoardState);
            console.log("unoccupiedSquaresIndexes", unoccupiedSquaresIndexes);

            console.log(unoccupiedSquaresIndexes[i]);
            console.log(currentBoardState);
            console.log(unoccupiedSquaresIndexes);

            squaresArray[unoccupiedSquaresIndexes[i]].textContent = "";

            squaresArray[unoccupiedSquaresIndexes[i]].dataset.status = "unoccupied";

            allTestPlayInfos.push(currentTestPlayInfo);
            console.log(allTestPlayInfos)
            console.log(currentTestPlayInfo)
        }

        let bestTestPlay = null;

        console.log(allTestPlayInfos)
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
        console.log(allTestPlayInfos[bestTestPlay])
        return allTestPlayInfos[bestTestPlay];
    }

    const gameEndPatternExists = (playerMarker) => {
        // let squares = getSquares();

        if (horizontalWinningPattern(playerMarker, squaresArray, displayController.playerArray)) return true;

        if (vericalWinningPatternExists(playerMarker, squaresArray, displayController.playerArray)) return true;

        if (diagonalWinningPatternExists(playerMarker, squaresArray, displayController.playerArray)) return true;

        if (drawPatternExists()) {
            declareWinner(null);
            return true;
        }
        return false;
    }

    //checks the horizontal winning conditon for a player
    const horizontalWinningPattern = (playerMarker, squaresArray, playerArray) => {
        let i = 0;
        while (i < 9) {
            if (squaresArray[i].textContent === squaresArray[i + 1].textContent && squaresArray[i + 1].textContent === squaresArray[i + 2].textContent && squaresArray[i].textContent !== "" && squaresArray[i].textContent === playerMarker) {
                for (let player of playerArray) {
                    //checks which marker value wins and matches it to the corresponding player
                    if (player.getMarker() === playerMarker) {
                        declareWinner(player);

                        // squaresArray[i].classList.add("win-squares");
                        // squaresArray[i + 1].classList.add("win-squares");
                        // squaresArray[i + 2].classList.add("win-squares");
                    }
                }
                return true;
            }
            i = i + 3;
        }
    }

    //checks the vertical winning conditon for a player
    const vericalWinningPatternExists = (playerMarker, squaresArray, playerArray) => {
        let j = 0;
        while (j < 3) {
            if (squaresArray[j].textContent === squaresArray[j + 3].textContent && squaresArray[j + 3].textContent === squaresArray[j + 6].textContent && squaresArray[j].textContent !== "" && squaresArray[j].textContent === playerMarker) {
                for (let player of playerArray) {
                    if (player.getMarker() === playerMarker) {
                        declareWinner(player);
                        // squaresArray[j].classList.add("win-squares");
                        // squaresArray[j + 3].classList.add("win-squares");
                        // squaresArray[j + 6].classList.add("win-squares");
                    }
                };
                return true;
            }
            j++;
        }
    }

    //checks the diagonal winning conditon for a player
    const diagonalWinningPatternExists = (playerMarker, squaresArray, playerArray) => {
        let k = 0;
        while (k < 3) {
            if (k === 0) {
                if (squaresArray[k].textContent === squaresArray[k + 4].textContent && squaresArray[k + 4].textContent === squaresArray[k + 8].textContent && squaresArray[k].textContent !== "" && squaresArray[k].textContent === playerMarker) {
                    for (let player of playerArray) {
                        if (player.getMarker() === playerMarker) {

                            // declareWinner(player);
                            // squaresArray[k].classList.add("win-squares");
                            // squaresArray[k + 4].classList.add("win-squares");
                            // squaresArray[k + 8].classList.add("win-squares");

                        }
                    }
                    return true;
                }
            }

            else {
                if (squaresArray[k].textContent === squaresArray[k + 2].textContent && squaresArray[k + 2].textContent === squaresArray[k + 4].textContent && squaresArray[k].textContent !== "") {
                    for (let player of displayController.playerArray) {
                        if (player.getMarker() === squaresArray[k].textContent) {

                            // declareWinner(player);
                            // squaresArray[k].classList.add("win-squares");
                            // squaresArray[k + 2].classList.add("win-squares");
                            // squaresArray[k + 4].classList.add("win-squares");
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