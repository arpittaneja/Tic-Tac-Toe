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
    const getSquares = () => Array.from(document.querySelectorAll(".square"));
    let unoccupiedSquares = getSquares();

    const newGame = () => {
        displayController.playerPointer = 0;
        gameBoard.textContent = "";
        displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

        //loop to create all squares
        for (let i = 0; i < 9; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.dataset.status = "unoccupied";
            square.addEventListener("click", onClick);
            gameBoard.appendChild(square)
        }
        unoccupiedSquares = getSquares();
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

            e.target.dataset.status = "occupied";

            unoccupiedSquares = unoccupiedSquares.filter(item => item.dataset.status === "unoccupied");
            if (gameEndPatternExists()) {
                return;
            }

            changePlayer(displayController.playerPointer);
            displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);

            randomPlayerTurn();
        }
    }

    const changePlayer = (playerPointer) => {
        displayController.playerPointer = (playerPointer === 0) ? 1 : 0;
    }

    const randomPlayerTurn = () => {

        //selects a random square from all the unoccupied squares
        let randomUnoccupiedSquare = unoccupiedSquares[Math.floor(Math.random() * unoccupiedSquares.length)];

        randomUnoccupiedSquare.textContent =
            displayController.playerArray
            [displayController.playerPointer].getMarker();
        
        //updates the "data-marker" attribute to the marker value
        randomUnoccupiedSquare.dataset.marker = displayController.playerArray
        [displayController.playerPointer].getMarker();

        //updates the "data-player-name" attribute to the player name value

        randomUnoccupiedSquare.dataset.playerName = displayController.playerArray
        [displayController.playerPointer].getName();
        randomUnoccupiedSquare.dataset.status = "occupied";

        // remove the randomly selectes square from the unoccupiedSquares array
        unoccupiedSquares = unoccupiedSquares.filter(item => item.dataset.status === "unoccupied");

        if (gameEndPatternExists()) {
            return;
        }

        changePlayer(displayController.playerPointer);

        //updates the turn text to match the turn of next player
        displayController.updateTurnText(displayController.playerTurn, displayController.playerArray, displayController.playerPointer);
    }

    //checks the horizontal winning conditon for a player
    const horizontalWinningPattern = (squares, playerArray) => {
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
    const vericalWinningPatternExists = (squares, playerArray) => {
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
    const diagonalWinningPatternExists = (squares, playerArray) => {
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

    const drawPatternExists = () => {
        if (unoccupiedSquares.length === 0) {
            return true;
        }
    }

    const gameEndPatternExists = () => {
        let squares = getSquares();

        if (horizontalWinningPattern(squares, displayController.playerArray)) return true;

        if (vericalWinningPatternExists(squares, displayController.playerArray)) return true;

        if (diagonalWinningPatternExists(squares, displayController.playerArray)) return true;

        if (drawPatternExists()) {
            displayWinnerName("Game Draw!");
            return true;
        }
    }

    const displayWinnerName = (name) => {
        displayController.updateWinnerName(name);
        displayController.playerPointer = 0;
        let squares = getSquares();
        for (let square of squares) {
            square.removeEventListener("click", onClick);
        }
        // numberOfSquaresClicked = 0;
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