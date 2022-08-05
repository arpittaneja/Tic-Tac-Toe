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
    const fillSquares = () => {
        gameBoard.textContent = "";
        for (let i = 0; i < 9; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            gameBoard.appendChild(square)
            square.dataset.number = squareArray[i];
        }
    }

    // const square = document.createElement("div");
    // square.classList.add("square");
    // gameBoard.appendChild(square);

    // const square2 = document.createElement("div");
    // square2.classList.add("square");
    // gameBoard.appendChild(square2);

    const getSquares = () => document.querySelectorAll(".square");
    // const squares = 
    // console.log(squares);

    const fun = () => {
        const squares = document.querySelectorAll(".square");
        for (let square of squares) {
            square.addEventListener("click", click);
            // console.log(square);
        }
    };


    function click(e) {
        if (e.target.dataset.status !== "occupied") {
            // if (count % 2 === 0) {
            // console.log(e.target);
            e.target.textContent = playerArray
            [playerPointer].getMarker();
            e.target.dataset.marker = playerArray
            [playerPointer].getMarker();
            console.log(e.target.dataset.marker);
            playerPointer = (playerPointer === 0) ? 1 : 0;
            // }
            // else {
            // e.target.textContent = "O";
            // }
            e.target.dataset.status = "occupied";
            // count++;
        }
        checkWinner();
    }

    const checkWinner = () => {
        let squares = getSquares();
        console.log(squares);
        console.log(squares[0].dataset.marker)
        console.log(squares[1].dataset.marker)
        console.log(squares[2].dataset.marker)

        let i = 0;
        while (i < 9) {
            if (squares[i].dataset.marker === squares[i+1].dataset.marker && squares[i+1].dataset.marker === squares[i+2].dataset.marker && squares[i].dataset.marker !== undefined) {
                alert("You won");
                fillSquares();
                return;
            }
            i = i + 3;
        }

        let j = 0;
        while (j < 3) {
            if (squares[j].dataset.marker === squares[j + 3].dataset.marker && squares[j + 3].dataset.marker === squares[j + 6].dataset.marker && squares[j].dataset.marker !== undefined) {
                alert("You won");
                fillSquares();
                return;
            }
            j++;
        }

        let k = 0;
        while (k < 3) {
            if (k === 0) {
                if (squares[k].dataset.marker === squares[k + 4].dataset.marker && squares[k + 4].dataset.marker === squares[k + 8].dataset.marker && squares[k].dataset.marker !== undefined) {
                    alert("You won");
                    fillSquares();
                    return;
                }
                
            }

            else {
                if (squares[k].dataset.marker === squares[k + 2].dataset.marker && squares[k + 2].dataset.marker === squares[k + 4].dataset.marker && squares[k].dataset.marker !== undefined) {
                    alert("You won");
                    fillSquares();
                    return;
                }
            }
            k+=2;
        }
    }


    // if (squares[0].dataset.marker === squares[1].dataset.marker && squares[1].dataset.marker === squares[2].dataset.marker && squares[0].dataset.marker !== undefined) {
    //     alert("You won");
    // }
    // let {player} = 
    // const list = (player) => {
    //     const squares = document.querySelectorAll(".square");
    //     for (let square of squares) {
    //         square.addEventListener("click", (player) => {

    //         })
    //     }
    // }
    return { fun, fillSquares, click, getSquares, checkWinner };
})();


// const playerOneName = prompt("Enter Player 1 name", "Player 1");
// const playerTwoName = prompt("Enter Player 2 name", "Player 2");

gameBoardModule.fillSquares();
gameBoardModule.fun();

// console.log(gameBoardModule.getSquares());
// gameBoardModule.checkWinner();

const playerOne = Player("playerOneName", 0);
console.log(playerOne.getMarker("playerOneName"));

const playerTwo = Player("playerTwoName", 1);
console.log(playerTwo.getMarker("playerTwoName"));
let playerPointer = 0;
playerArray = [playerOne, playerTwo];


// console.log(playerArray);
// console.log(gameBoardModule.squares);

//addEventListener to all boxes
