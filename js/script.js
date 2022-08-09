const Player = (name, turn) => {
    const getName = () => name;
    const getTurn = () => turn;
    const marker = (turn === 0) ? "X" : "O";
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

        squares = getSquares();
        for (let square of squares) {
            square.addEventListener("click", onClick);
        }
    }

    const getSquares = () => document.querySelectorAll(".square");

    // const addClick = () => {
    //     const squares = document.querySelectorAll(".square");
    //     for (let square of squares) {
    //         square.addEventListener("click", click);
    //     }
    // };

    let squaresClicked = 0;

    function onClick(e) {
        if (e.target.dataset.status !== "occupied") {
            e.target.textContent = playerArray
            [playerPointer].getMarker();
            e.target.dataset.marker = playerArray
            [playerPointer].getMarker();
            e.target.dataset.playerName = playerArray
            [playerPointer].getName();
            playerPointer = (playerPointer === 0) ? 1 : 0;
            displayController.playerTurn.textContent = "Player " + playerArray
            [playerPointer].getName() + ", Your turn!";
            e.target.dataset.status = "occupied";
            squaresClicked++;
        }
        findWinPattern();
    }


    const findWinPattern = () => {
        let squares = getSquares();
        console.log(squares);

        let i = 0;
        while (i < 9) {
            if (squares[i].dataset.marker === squares[i + 1].dataset.marker && squares[i + 1].dataset.marker === squares[i + 2].dataset.marker && squares[i].dataset.marker !== undefined) {
                for (let player of playerArray) {
                    if (player.getMarker() === squares[i].dataset.marker) {
                        displayWinnerName(player.getName());
                    }
                }
                newGame();
                return;
            }
            i = i + 3;
        }

        let j = 0;
        while (j < 3) {
            if (squares[j].dataset.marker === squares[j + 3].dataset.marker && squares[j + 3].dataset.marker === squares[j + 6].dataset.marker && squares[j].dataset.marker !== undefined) {
                for (let player of playerArray) {
                    if (player.getMarker() === squares[j].dataset.marker) {
                        displayWinnerName(player.getName());
                    }
                };
                newGame();
                return;
            }
            j++;
        }

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
                    return;
                }
            }

            else {
                if (squares[k].dataset.marker === squares[k + 2].dataset.marker && squares[k + 2].dataset.marker === squares[k + 4].dataset.marker && squares[k].dataset.marker !== undefined) {
                    for (let player of playerArray) {
                        if (player.getMarker() === squares[k].dataset.marker) {

                            displayWinnerName(player.getName());
                        }
                    }
                    newGame();
                    return;
                }
            }
            k += 2;
        }

        if (squaresClicked === 9) {
            alert("gameDraw");
            newGame();
        }
    }

    const displayWinnerName = (name) => {
        alert(name + " won");
        playerPointer = 0;
        squaresClicked = 0;
    }

    return { newGame, findWinPattern };
})();


// const playerOneName = prompt("Enter Player 1 name", "Player 1");
// const playerTwoName = prompt("Enter Player 2 name", "Player 2");
const playerOne = Player("One", 0);
const playerTwo = Player("Two", 1);

let playerPointer = 0;
const playerArray = [playerOne, playerTwo];
gameBoardModule.newGame();
// gameBoardModule.fun();



// console.log(playerOne.getMarker("playerOneName"));
// console.log(playerTwo.getMarker("playerTwoName"));


const displayController = (() => {
    const restartButton = document.querySelector(".restart");
    restartButton.addEventListener("click", restartGame);
    const playerTurn = document.querySelector(".player-turn");
    
    function restartGame(e) {
        gameBoardModule.newGame();
    }

    return {
        playerTurn,
    }
})();