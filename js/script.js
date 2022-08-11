//player factory
const Player = (name, marker) => {
    const getName = () => name;
    const getTurn = () => turn;
    const getMarker = () => marker;

    return { getName, getTurn, getMarker };
};

//game board module
const gameBoard = (() => {
    const gameBoard = document.querySelector(".game-board");
    let squaresClicked = 0;

    const getSquares = () => document.querySelectorAll(".square");

    const newGame = () => {
        displayController.playerPointer = 0;
        squaresClicked = 0;
        gameBoard.textContent = "";
        displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

        //loop tp create all squares
        for (let i = 0; i < 9; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            gameBoard.appendChild(square)
        }

        let squares = getSquares();
        for (let square of squares) {
            square.addEventListener("click", onClick);
        }
    }

    const onClick = (e) => {
        if (e.target.dataset.status !== "occupied") {
            e.target.textContent = displayController.playerArray
            [displayController.playerPointer].getMarker();
            //updates the "data-marker" attribute to the marker value
            e.target.dataset.marker = displayController.playerArray
            [displayController.playerPointer].getMarker();
            //updates the "data-player-name" attribute to the player name value
            e.target.dataset.playerName = displayController.playerArray
            [displayController.playerPointer].getName();

            changePlayer(displayController.playerPointer);

            //updates the turn text to match the turn of next player
            displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

            e.target.dataset.status = "occupied";
            squaresClicked++;
        }
        checkWinPattern();
    }

    const changePlayer = (playerPointer) => {
        displayController.playerPointer = (playerPointer === 0) ? 1 : 0;
    }

    //checks the horizontal winning conditon for a player
    const checkHorizontalWinPattern = (squares, playerArray) => {
        let i = 0;
        while (i < 9) {
            if (squares[i].dataset.marker === squares[i + 1].dataset.marker && squares[i + 1].dataset.marker === squares[i + 2].dataset.marker && squares[i].dataset.marker !== undefined) {
                for (let player of playerArray) {
                    //checks which marker value wins and matches it to the corresponding player
                    if (player.getMarker() === squares[i].dataset.marker) {
                        displayWinnerName(player.getName());
                        squares[i].classList.add("win-squares");
                        squares[i + 1].classList.add("win-squares");
                        squares[i + 2].classList.add("win-squares");
                    }
                }
                return true;
            }
            i = i + 3;
        }
    }

    //checks the vertical winning conditon for a player
    const checkVericalWinPattern = (squares, playerArray) => {
        let j = 0;
        while (j < 3) {
            if (squares[j].dataset.marker === squares[j + 3].dataset.marker && squares[j + 3].dataset.marker === squares[j + 6].dataset.marker && squares[j].dataset.marker !== undefined) {
                for (let player of playerArray) {
                    if (player.getMarker() === squares[j].dataset.marker) {
                        displayWinnerName(player.getName());
                        squares[j].classList.add("win-squares");
                        squares[j + 3].classList.add("win-squares");
                        squares[j + 6].classList.add("win-squares");
                    }
                };
                return true;
            }
            j++;
        }
    }

    //checks the diagonal winning conditon for a player
    const checkDiagonalWinPattern = (squares, playerArray) => {
        let k = 0;
        while (k < 3) {
            if (k === 0) {
                if (squares[k].dataset.marker === squares[k + 4].dataset.marker && squares[k + 4].dataset.marker === squares[k + 8].dataset.marker && squares[k].dataset.marker !== undefined) {
                    for (let player of playerArray) {
                        if (player.getMarker() === squares[k].dataset.marker) {

                            displayWinnerName(player.getName());
                            squares[k].classList.add("win-squares");
                            squares[k + 4].classList.add("win-squares");
                            squares[k + 8].classList.add("win-squares");

                        }
                    }
                    return true;
                }
            }

            else {
                if (squares[k].dataset.marker === squares[k + 2].dataset.marker && squares[k + 2].dataset.marker === squares[k + 4].dataset.marker && squares[k].dataset.marker !== undefined) {
                    for (let player of displayController.playerArray) {
                        if (player.getMarker() === squares[k].dataset.marker) {

                            displayWinnerName(player.getName());
                            squares[k].classList.add("win-squares");
                            squares[k + 2].classList.add("win-squares");
                            squares[k + 4].classList.add("win-squares");
                        }
                    }
                    return true;
                }
            }
            k += 2;
        }
    }

    const checkDrawPattern = (squaresClicked) => {
        if (squaresClicked === 9) {
            displayWinnerName("Game Draw!");
        }
    }


    const checkWinPattern = () => {
        let squares = getSquares();

        if (checkHorizontalWinPattern(squares, displayController.playerArray) === true) return;

        if (checkVericalWinPattern(squares, displayController.playerArray) === true) return;

        if (checkDiagonalWinPattern(squares, displayController.playerArray) === true) return;

        checkDrawPattern(squaresClicked);
    }

    const displayWinnerName = (name) => {
        displayController.updateWinnerName(name);
        displayController.playerPointer = 0;
        let squares = getSquares();
        for (let square of squares) {
            square.removeEventListener("click", onClick);
        }
        squaresClicked = 0;
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