const player = (name) => {
    const getName = () => name;
};

const gameBoardModule = (() => {
    const gameBoard = document.querySelector(".game-board");
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const fillSquares = () => {
        for (let i = 0; i < 9; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            gameBoard.appendChild(square);
            square.dataset.number = arr[i];
        }
    }

    // const square = document.createElement("div");
    // square.classList.add("square");
    // gameBoard.appendChild(square);

    // const square2 = document.createElement("div");
    // square2.classList.add("square");
    // gameBoard.appendChild(square2);


    const fun = () => {
        let count = 0;
        const squares = document.querySelectorAll(".square");
        for (let square of squares) {
            square.addEventListener("click", (e) => {
                if (e.target.dataset.status !== "occupied") {
                    if (count % 2 === 0) {
                        console.log(e.target);
                        e.target.textContent = "x";
                    }
                    else {
                        e.target.textContent = "O";
                    }
                    e.target.dataset.status = "occupied";
                    count++;
                }
            })
            console.log(square);
        }
    };

    // const list = (player) => {
    //     const squares = document.querySelectorAll(".square");
    //     for (let square of squares) {
    //         square.addEventListener("click", (player) => {

    //         })
    //     }
    // }
    return { fun, fillSquares };
})();

gameBoardModule.fillSquares();
gameBoardModule.fun();

