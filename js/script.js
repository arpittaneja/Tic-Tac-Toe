const Player = (name, marker) => {
    const getName = () => name;
    const getTurn = () => turn;
    const getMarker = () => marker;

    return { getName, getTurn, getMarker };
};

const gameBoardModule = (() => {
    const gameBoard = document.querySelector(".game-board");
    const squareArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const newGame = () => {
        gameBoard.textContent = "";
        for (let i = 0; i < 9; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            gameBoard.appendChild(square)
            square.dataset.number = squareArray[i];
        }

        let squares = getSquares();
        for (let square of squares) {
            square.addEventListener("click", onClick);
        }
    }

    const getSquares = () => document.querySelectorAll(".square");

    let squaresClicked = 0;

    const onClick = (e) => {
        if (e.target.dataset.status !== "occupied") {
            e.target.textContent = displayController.playerArray
            [displayController.playerPointer].getMarker();
            e.target.dataset.marker = displayController.playerArray
            [displayController.playerPointer].getMarker();
            e.target.dataset.playerName = displayController.playerArray
            [displayController.playerPointer].getName();

            changePlayer(displayController.playerPointer);
            displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

            e.target.dataset.status = "occupied";
            squaresClicked++;
        }
        findWinPattern();
    }


    const changePlayer = (playerPointer) => {
        displayController.playerPointer = (playerPointer === 0) ? 1 : 0;
    }

    const findHorizontalWinPattern = (squares, playerArray) => {
        let i = 0;
        while (i < 9) {
            if (squares[i].dataset.marker === squares[i + 1].dataset.marker && squares[i + 1].dataset.marker === squares[i + 2].dataset.marker && squares[i].dataset.marker !== undefined) {
                for (let player of playerArray) {
                    if (player.getMarker() === squares[i].dataset.marker) {
                        displayWinnerName(player.getName());
                    }
                }
                newGame();
                return true;
            }
            i = i + 3;
        }
    }

    const findVericalWinPattern = (squares, playerArray) => {
        let j = 0;
        while (j < 3) {
            if (squares[j].dataset.marker === squares[j + 3].dataset.marker && squares[j + 3].dataset.marker === squares[j + 6].dataset.marker && squares[j].dataset.marker !== undefined) {
                for (let player of playerArray) {
                    if (player.getMarker() === squares[j].dataset.marker) {
                        displayWinnerName(player.getName());
                    }
                };
                newGame();
                return true;
            }
            j++;
        }
    }

    const findDiagonalWinPattern = (squares, playerArray) => {
        let k = 0;
        while (k < 3) {
            if (k === 0) {
                if (squares[k].dataset.marker === squares[k + 4].dataset.marker && squares[k + 4].dataset.marker === squares[k + 8].dataset.marker && squares[k].dataset.marker !== undefined) {
                    for (let player of playerArray) {
                        if (player.getMarker() === squares[k].dataset.marker) {

                            displayWinnerName(player.getName());
                        }
                    }
                    newGame();
                    return true;
                }
            }

            else {
                if (squares[k].dataset.marker === squares[k + 2].dataset.marker && squares[k + 2].dataset.marker === squares[k + 4].dataset.marker && squares[k].dataset.marker !== undefined) {
                    for (let player of displayController.playerArray) {
                        if (player.getMarker() === squares[k].dataset.marker) {

                            displayWinnerName(player.getName());
                        }
                    }
                    newGame();
                    return true;
                }
            }
            k += 2;
        }
    }

    const findWinPattern = () => {
        let squares = getSquares();
        // console.log(squares);
        if (findHorizontalWinPattern(squares, displayController.playerArray) === true) return;

        if (findVericalWinPattern(squares, displayController.playerArray) === true) return;

        if (findDiagonalWinPattern(squares, displayController.playerArray) === true) return;

        if (squaresClicked === 9) {
            alert("gameDraw");
            newGame();
        }
    }

    const displayWinnerName = (name) => {
        alert(name + " won");
        displayController.playerPointer = 0;
        displayController.playerTurn.textContent = "Player " + displayController.playerArray
        [displayController.playerPointer].getName() + ", Your turn!";
        squaresClicked = 0;
    }

    return { newGame };
})();

const displayController = (() => {
    const playerOne = Player("One", "X");
    const playerTwo = Player("Two", "O");

    let playerPointer = 0;
    const playerArray = [playerOne, playerTwo];
    const restartButton = document.querySelector(".restart");
    restartButton.addEventListener("click", restartGame);
    const playerTurn = document.querySelector(".player-turn");

    const updateTurnText = (playerTurn, playerArray, playerPointer) => {
        playerTurn.textContent = "Player " + playerArray[playerPointer].getName() + ", Your turn!";
    }

    function restartGame(e) {
        gameBoardModule.newGame();
    }

    return {
        playerTurn, playerPointer, playerArray, updateTurnText
    }
})();

gameBoardModule.newGame();