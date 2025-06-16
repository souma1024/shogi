const movementPatterns = {
    1: { directions: [[-1, 0]]},  //歩
    2: { directions: [[-1, 0]], repeat: true }, // 香車
    3: { directions: [[-2, -1], [-2, 1]] }, // 桂馬
    4: { directions: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 1]] }, // 銀
    5: { directions: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0]] }, // 金

    6: { directions: [[-1, -1], [-1, 1], [1, -1], [1, 1]], repeat: true }, // 角
    7: { directions: [[-1, 0], [1, 0], [0, -1], [0, 1]], repeat: true }, // 飛車

    8: { directions: [ // 馬
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ],
          repeat: true, 
          add: [[-1, 0], [1, 0], [0, -1], [0, 1]] },
    9: { directions: [  // 龍王
                [-1, 0], [1, 0], [0, -1], [0, 1]
            ], 
         repeat: true,
         add: [[-1, -1], [-1, 1], [1, -1], [1, 1]] },

    10: { directions: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0]] }, // と金（成り歩）など = 金と同じ
    77: { directions: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]] }, // 王

} 

const komaName = {
    1: "歩",
    2: "香",
    3: "桂",
    4: "銀",
    5: "金",
    6: "角",
    7: "飛",
    8: "馬",
    9: "龍",
    10: "成",
    77: "王"
}


function init() {
    let gameBoard = [
        [-2, -3, -4, -5, -77, -5, -4, -3, -2],
        [0, -7, 0, 0, 0, 0, 0, -6, 0],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 6, 0, 0, 0, 0, 0, 7, 0],
        [2, 3, 4, 5, 77, 5, 4, 3, 2]  
    ];

    let opponentList = [0, 0, 0, 0, 0, 0, 0, 0];
    let playerList = [0, 0, 0, 0, 0, 0, 0, 0];

    debugDisplay(gameBoard, -1);

    let order = 0;
    let from = null;    

    let cells = document.getElementsByClassName("cell");
    for (let [index, cell] of Object.entries(cells)) {
        cell.addEventListener("click", () => {
            let direct = order % 2 === 0 ? 1 : -1;
            let num = parseInt(index, 10);
            let row = Math.floor(num / 9);
            let col = num % 9;
            
            if (from === null) {
                if (direct * gameBoard[row][col] <= 0) return; // 自分の駒以外は選べない
                from = {row, col};
                highlightMovableCells(from, gameBoard[row][col], gameBoard); // ハイライト呼び出し
                return;
            }

            if (from.row === row && from.col === col || direct * gameBoard[from.row][from.col] < 0) {
                from = null;
                removeHighlights();
                return;
            }

            let to = {row, col};
            let koma = gameBoard[from.row][from.col];


            if (!isMovable(from, to, koma, gameBoard)) {
                return;
            }
            
            if (gameBoard[from.row][from.col] * gameBoard[to.row][to.col] < 0) {
                if (direct === 1) {
                    playerList[Math.abs(gameBoard[to.row][to.col])]++;
                    debugSubDisplay(playerList, direct);
                } else {
                    opponentList[gameBoard[to.row][to.col]]++;
                    debugSubDisplay(opponentList, direct);
                }
            }
            
            let temp = gameBoard[from.row][from.col];
            gameBoard[from.row][from.col] = 0;
            gameBoard[to.row][to.col] = temp;
            from = null;
            removeHighlights();
            order++;
            debugDisplay(gameBoard, direct);
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
            // 壁外・駒に当たったら break
            if (r < 0 || r >= 9 || c < 0 || c >= 9 || board[r][c] != 0) {
                break;
            }
        }
    }

    return false;
}


function debugSubDisplay(list, direct) {
    let subCells;
    if (direct === 1) {
        subCells = document.getElementById("player").getElementsByClassName("sub-cell");
    } else {
        subCells = document.getElementById("opponent").getElementsByClassName("sub-cell");
    }

    for (let [index, cell] of Object.entries(subCells)) {
        if (list[index] > 0) {
            cell.innerHTML = `${komaName[index]}`;
        }
    }
    
}

function debugDisplay(board, direct) {
    let cells  = document.getElementsByClassName("cell");

    for (let [index, cell] of Object.entries(cells)) {
        let num = parseInt(index, 10);
        let row = Math.floor(num / 9);
        let col = num % 9;

        let isOpponent = board[row][col] < 0 ? true : false;

        let koma = Math.abs(board[row][col]);
        if (koma !== 0) {
            if (isOpponent) {
                cell.innerHTML = `<p style='color: red;'>${komaName[koma]}</p>`;  
            } else {
                cell.innerHTML = `<p>${komaName[koma]}</p>`;  
            }
        }

        if (koma === 0) {
            cell.innerHTML = "";
        }

    }
    const directDiv = document.getElementById("direct");
    directDiv.innerHTML = -1 * direct;

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

function highlightMovableCells(from, koma, board) {

    removeHighlights();

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (isMovable(from, {row: r, col: c}, koma, board)) {
                const index = r * 9 + c;
                document.getElementsByClassName("cell")[index].classList.add("highlight");
            }
        }
    }
}

function removeHighlights() {
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.classList.remove("highlight");
    }
}

init();