'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

// function countNeighbors(cellI, cellJ, mat) {
//     var neighborsCount = 0;
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j >= mat[i].length) continue;
//             if (i === cellI && j === cellJ) continue;
//             if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsCount++;
//             // if (mat[i][j]) neighborsCount++;
//         }
//     }
//     return neighborsCount;
// }

// function renderBoard(board) {
//     // console.table(board);
//     var strHtml = '';

//     for (var i = 0; i < board.length; i++) {
//         strHtml += '<tr>'
//         for (var j = 0; j < board[0].length; j++) {
//             var cell = board[i][j];
//             var className = (cell) ? 'occupied' : '';
//             strHtml += `<td class="${className}"
//             data-i="${i}" data-j="${j}"
//             onclick="cellClicked(this,${i},${j})"
//             > ${cell} </td>`;
//         }
//         strHtml += '</tr>'
//     }
//     // console.log('strHtml', strHtml)
//     var elBoard = document.querySelector('.board');
//     elBoard.innerHTML = strHtml;

// }

// function createMat(size, cell) {
//     var mat = [];

//     for (var i = 0; i < size; i++) {
//         mat[i] = []
//         for (var j = 0; j < size; j++) {
//             mat[i][j] = cell;
//         }
//     }
//     return mat
// }