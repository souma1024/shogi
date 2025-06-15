const movementPatterns = {
    1: { directions: [[-1, 0]]},  //歩
    4: { directions: [[-1, 0]], repeat: true }, // 香車
    5: { directions: [[-2, -1], [-2, 1]] }, // 桂馬
    6: { directions: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 1]] }, // 銀
    7: { directions: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0]] }, // 金

    8: { directions: [[-1, -1], [-1, 1], [1, -1], [1, 1]], repeat: true }, // 角
    9: { directions: [[-1, 0], [1, 0], [0, -1], [0, 1]], repeat: true }, // 飛車

    10: { directions: [  // 龍王
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ], 
         repeat: true,
         add: [[-1, -1], [-1, 1], [1, -1], [1, 1]] },

    11: { directions: [ // 馬
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ],
          repeat: true, 
          add: [[-1, 0], [1, 0], [0, -1], [0, 1]] },

    20: { directions: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0]] }, // と金（成り歩）など = 金と同じ
    77: { directions: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]] }, // 王

} 

const komaName = {
    1: "歩",
    4: "香",
    5: "桂",
    6: "銀",
    7: "金",
    8: "角",
    9: "飛",
    77: "王"
}


function init() {
    let gameBoard = [
        [-4, -5, -6, -7, -77, -7, -6, -5, -4],
        [0, -9, 0, 0, 0, 0, 0, -8, 0],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 8, 0, 0, 0, 0, 0, 9, 0],
        [4, 5, 6, 7, 77, 7, 6, 5, 4]  
    ];

    debugDisplay(gameBoard);

    let order = 0;
    let from = null;    

    let cells = document.getElementsByClassName("cell");
    for (let [index, cell] of Object.entries(cells)) {
        cell.addEventListener("click", () => {
            let direct = order % 2 === 0 ? -1 : 1;
            let num = parseInt(index, 10);
            let row = Math.floor(num / 9);
            let col = num % 9;

            if (from === null) {
                from = {row, col};
                return;
            }

            if (from.row === row && from.col === col) {
                from = null;
                return;
            }

            let to = {row, col};
            let koma = gameBoard[from.row][from.col];

            if (!isMovable(from, to, koma, gameBoard)) {
                return;
            }
            
            
            let temp = gameBoard[from.row][from.col];
            gameBoard[from.row][from.col] = 0;
            gameBoard[to.row][to.col] = temp;
            debugDisplay(gameBoard);
            from = null;
            order++;
        })
    }
}

function isMovable(from, to, koma, board) {
    const sign = Math.sign(koma);
    const absKoma = Math.abs(koma);
    const moveInfo = movementPatterns[absKoma];

    if (!moveInfo) {
        return false;
    }

    const directions = [...moveInfo.directions];
    if (moveInfo.add) directions.push(...moveInfo.add);

    for (const [dr, dc] of directions) {
        for (let step = 1; step <= (moveInfo.repeat ? 8 : 1); step++) {
            const r = from.row + (dr * step) * sign;
            const c = from.col + (dc * step) * sign;
            if (r === to.row && c === to.col) {
                if ((sign > 0 && board[r][c] >= 1) || (sign < 0 && board[r][c] <= -1)) {
                    return false;
                }

                return true;
            }
            // 壁外・駒に当たったら break するのが理想
            if (board[r][c] === undefined || board[r][c] != 0) {
                break;
            }
        }
    }

    return false;
}



function debugDisplay(board) {
    let cells  = document.getElementsByClassName("cell");

    for (let [index, cell] of Object.entries(cells)) {
        let num = parseInt(index, 10);
        let row = Math.floor(num / 9);
        let col = num % 9;

        let koma = Math.abs(board[row][col]);
        if (koma !== 0) {
            cell.innerHTML = `${komaName[koma]}`;   
        }

        if (koma === 0) {
            cell.innerHTML = "";
        }

    }

    const debugDiv = document.getElementById("debugArea");
    let html = "<table border='1' cellspacing='0' cellpadding='5' style='border-collapse: collapse;'>";
    for (let row = 0; row < 9; row++) {
        html += "<tr>";
        for (let col = 0; col < 9; col++) {
            let val = board[row][col];
            html += `<td style="width: 30px; text-align: center;">${val}</td>`;
        }
        html += "</tr>";
    }
    html += "</table>";
    debugDiv.innerHTML = html;

}


init();