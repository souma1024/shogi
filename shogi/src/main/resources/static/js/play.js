
function init() {
    let gameBoard = [
        [4, 5, 6, 7, 10, 7, 6, 5, 4],
        [0, 9, 0, 0, 0, 0, 0, 8, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 8, 0, 0, 0, 0, 0, 9, 0],
        [4, 5, 6, 7, 10, 7, 6, 5, 4]  
    ];

    let order = 0;
    

    let cells = document.getElementsByClassName("cell");
    for (let [index, cell] of Object.entries(cells)) {
        cell.addEventListener("click", () => {
            let num = parseInt(index, 10);
            let row = Math.floor(num / 9);
            let col = num % 9;

            let direct = order % 2 == 0 ? -1 : 1;

            let temp = gameBoard[row][col];
            gameBoard[row][col] = 0;
            gameBoard[row + direct][col % 9] = temp;
            console.log(gameBoard);
            order++;
        })
    }
}

init();