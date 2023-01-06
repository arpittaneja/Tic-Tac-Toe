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
    let winnerInfo = null;

    const getUnoccupiedSquareIndexes = (currentBoardState) => {
        return currentBoardState.filter(i => i != "X" && i != "O");
    }

    const newGame = () => {
        displayController.playerPointer = 0;
        gameBoardContainer.textContent = "";
        displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

        //loop to create all squares
        for (let i = 0; i < 9; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.textContent = "";
            square.addEventListener("click", onPlayerClick);
            gameBoardContainer.appendChild(square)
        }

        squaresArray = getSquares();
        currentBoardState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        unoccupiedSquaresIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    }

    const onPlayerClick = (e) => {
        if (e.target.textContent === "") {
            const playerMarker = displayController.playerArray[displayController.playerPointer].getMarker();

            //update the textContent of the clicked square to the current player's marker
            e.target.textContent = playerMarker;

            //update the currentBoardState array to reflect the new marker
            currentBoardState[squaresArray.indexOf(e.target)] = playerMarker;

            //update the unoccupiedSquaresIndexes array to reflect the new marker
            unoccupiedSquaresIndexes = getUnoccupiedSquareIndexes(currentBoardState);

            winnerInfo = checkGameEndPatternExists(playerMarker);
            //check if the game has ended
            if (winnerInfo[0]) {
                declareWinner(winnerInfo[1])
                changeWinningSquaresColor(winnerInfo.slice(2, 5));
                return;
            } else if (winnerInfo[0] === null) {
                declareWinner(null);
                return;
            }

            changePlayer(displayController.playerPointer);
            displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

            aiTurn();
        }
    }

    const changeWinningSquaresColor = (winnerInfo) => {
        winnerInfo.forEach((square) => {
            square.classList.add("win-squares");
        })
    }

    const changePlayer = (playerPointer) => {
        displayController.playerPointer = (playerPointer === 0) ? 1 : 0;
    }

    const aiTurn = () => {

        const aiMarker = displayController.playerArray[displayController.playerPointer].getMarker();
        //get the most optimum next move for the ai
        const bestPlayInfo = minimax(currentBoardState, aiMarker);

        //update the textContent of the clicked square to the ai's marker
        squaresArray[bestPlayInfo.index].textContent = aiMarker;

        //update the currentBoardState array to reflect the new marker
        currentBoardState[squaresArray.indexOf(squaresArray[bestPlayInfo.index])] = aiMarker;

        unoccupiedSquaresIndexes = getUnoccupiedSquareIndexes(currentBoardState);

        winnerInfo = checkGameEndPatternExists(aiMarker);
        //check if the game has ended
        if (winnerInfo[0]) {
            declareWinner(displayController.playerArray[displayController.playerPointer].getMarker())
            changeWinningSquaresColor(winnerInfo.slice(2, 5));
            return;
        }
        else if (winnerInfo[0] === null) {
            declareWinner(null);
            return;
        }

        changePlayer(displayController.playerPointer);
        displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);
    }

    const minimax = (currentBoardState, currentMarker) => {

        const unoccupiedSquaresIndexes = getUnoccupiedSquareIndexes(currentBoardState);

        if (checkGameEndPatternExists("O")[0]) {
            return { score: -1 };
        }
        else if (checkGameEndPatternExists("X")[0]) {
            return { score: 1 }
        }
        else if (unoccupiedSquaresIndexes.length === 0) {
            return { score: 0 };
        }

        const allPossibleMovesInfo = [];

        for (let i = 0; i < unoccupiedSquaresIndexes.length; i++) {
            const currentMoveInfo = {};

            currentMoveInfo.index = currentBoardState[unoccupiedSquaresIndexes[i]];

            currentBoardState[unoccupiedSquaresIndexes[i]] = currentMarker;

            squaresArray[unoccupiedSquaresIndexes[i]].textContent = currentMarker;

            if (currentMarker === "X") {
                let result = minimax(currentBoardState, "O");
                currentMoveInfo.score = result.score;
            } else {
                let result = minimax(currentBoardState, "X");
                currentMoveInfo.score = result.score;
            }

            currentBoardState[unoccupiedSquaresIndexes[i]] = currentMoveInfo.index;

            squaresArray[unoccupiedSquaresIndexes[i]].textContent = "";

            allPossibleMovesInfo.push(currentMoveInfo);
        }

        let bestTestPlay = null;

        if (currentMarker === "X") {
            let bestScore = -Infinity;
            for (let i = 0; i < allPossibleMovesInfo.length; i++) {
                if (allPossibleMovesInfo[i].score > bestScore) {
                    bestScore = allPossibleMovesInfo[i].score;
                    bestTestPlay = i;
                }
            }
        }
        else {
            let bestScore = Infinity;
            for (let i = 0; i < allPossibleMovesInfo.length; i++) {
                if (allPossibleMovesInfo[i].score < bestScore) {
                    bestScore = allPossibleMovesInfo[i].score;
                    bestTestPlay = i;
                }
            }
        }
        return allPossibleMovesInfo[bestTestPlay];
    }

    const checkGameEndPatternExists = (playerMarker) => {

        if (checkHorizontalWinningPatternExists(playerMarker, squaresArray)[0]) return [true, ...checkHorizontalWinningPatternExists(playerMarker, squaresArray).slice(1, 5)];

        if (checkVericalWinningPatternExists(playerMarker, squaresArray)[0]) return [true, ...checkVericalWinningPatternExists(playerMarker, squaresArray).slice(1, 5)];

        if (checkDiagonalWinningPatternExists(playerMarker, squaresArray)[0]) return [true, ...checkDiagonalWinningPatternExists(playerMarker, squaresArray).slice(1, 5)];

        if (checkDrawPatternExists()) {
            return [null];
        }
        return [false];
    }

    //checks the horizontal winning conditon for a player
    const checkHorizontalWinningPatternExists = (playerMarker, squaresArray) => {
        let i = 0;
        while (i < 9) {
            if (squaresArray[i].textContent === squaresArray[i + 1].textContent && squaresArray[i + 1].textContent === squaresArray[i + 2].textContent && squaresArray[i].textContent !== "" && squaresArray[i].textContent === playerMarker) {
                return [true, playerMarker, squaresArray[i], squaresArray[i + 1], squaresArray[i + 2]]
            }
            i = i + 3;
        }
        return [false];
    }

    //checks the vertical winning conditon for a player
    const checkVericalWinningPatternExists = (playerMarker, squaresArray) => {
        let j = 0;
        while (j < 3) {
            if (squaresArray[j].textContent === squaresArray[j + 3].textContent && squaresArray[j + 3].textContent === squaresArray[j + 6].textContent && squaresArray[j].textContent !== "" && squaresArray[j].textContent === playerMarker) {
                return [true, playerMarker, squaresArray[j], squaresArray[j + 3], squaresArray[j + 6]]
            }
            j++;
        }
        return [false];
    }

    //checks the diagonal winning conditon for a player
    const checkDiagonalWinningPatternExists = (playerMarker, squaresArray) => {
        let k = 0;
        while (k < 3) {
            if (k === 0) {
                if (squaresArray[k].textContent === squaresArray[k + 4].textContent && squaresArray[k + 4].textContent === squaresArray[k + 8].textContent && squaresArray[k].textContent !== "" && squaresArray[k].textContent === playerMarker) {
                    return [true, playerMarker, squaresArray[k], squaresArray[k + 4], squaresArray[k + 8]]
                }
            }
            else {
                if (squaresArray[k].textContent === squaresArray[k + 2].textContent && squaresArray[k + 2].textContent === squaresArray[k + 4].textContent && squaresArray[k].textContent !== "" && squaresArray[k].textContent === playerMarker) {
                    return [true, playerMarker, squaresArray[k], squaresArray[k + 2], squaresArray[k + 4]];
                }
            }
            k += 2;
        }
        return [false];
    }

    const checkDrawPatternExists = () => {
        if (unoccupiedSquaresIndexes.length === 0) {
            return true;
        }
    }

    const declareWinner = (playerMarker) => {
        if (playerMarker === null) displayController.updateWinnerName("Game Draw!");
        else {
            for (let player of displayController.playerArray) {
                if (player.getMarker() === playerMarker) {
                    displayController.updateWinnerName(player.getName());
                }
            }
        }
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
// gameBoard.aiTurn();