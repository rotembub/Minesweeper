'use strict'

var gBoard;

var gMine = '💣';
var gFlag = '🚩';

var gLives = 3;
var gMarkedCorrectly = 0;

var gMinesCoords;

var gTimerInterval;
// var gGame.isOn = false;

var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

//get back to it later:
const noContext = document.getElementById('noContextMenu');

noContext.addEventListener('contextmenu', e => {
    e.preventDefault();
});
// watchout




//This is called when page loads 
function init() {
    gLives = 3;
    gMarkedCorrectly = 0;
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gBoard = buildBoard();
    renderBoard(gBoard);
}

// Builds the board 
// Set mines at random locations
// Call setMinesNegsCount()
// Return the created board

function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    };
    return cell;
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = createCell();
            board[i][j] = cell;
        }
    }


    // placeMinesRandomly(gLevel.MINES, board);

    // gMinesCoords = [];
    // for (var i = 0; i < gLevel.SIZE; i++) {
    //     for (var j = 0; j < gLevel.SIZE; j++) {
    //         if (board[i][j].isMine) gMinesCoords.push({ i: i, j: j });
    //         board[i][j].minesAroundCount = setMinesNegsCount(i, j, board);
    //     }
    // }

    return board;
}



function placeMinesRandomly(num, board) {

    for (var i = 0; i < num; i++) {
        var currCell = board[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)];
        while (currCell.isMine) {
            currCell = board[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)];
        }
        currCell.isMine = true;

    }

}


// Count mines around each cell 
// and set the cell's 
// minesAroundCount.

function setMinesNegsCount(cellI, cellJ, mat) {
    var minesAroundCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) minesAroundCount++;
        }
    }
    return minesAroundCount;
}

function firstClickSetup() {
    placeMinesRandomly(gLevel.MINES, gBoard);
    gMinesCoords = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) gMinesCoords.push({ i: i, j: j });
            gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard);
        }
    }
    console.log(gMinesCoords);
}

// Render the board as a <table> 
// to the page

function renderBoard(board) {
    var strHTML = '<table>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var cellStartTag = `<td id="cell-${i}-${j}" oncontextmenu="cellMarked(this,${i},${j})" onclick="cellClicked(this,${i},${j})">`;
            if (cell.isMine) strHTML += cellStartTag + `<span>${gMine}</span></td>`;
            else {
                if (cell.minesAroundCount === 0) {
                    strHTML += cellStartTag + `<span></span></td>`;
                } else {
                    strHTML += cellStartTag + `<span>${cell.minesAroundCount}</span></td>`;
                }

            }
        }
        strHTML += '</tr>';
    }
    strHTML += '</table>';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Called when a cell (td) is 
// clicked


function cellClicked(elCell, i, j) {
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return;
    if (!gGame.isOn) startTimer();

    if (gGame.shownCount === 0) {
        firstClickSetup();
    }

    gGame.shownCount++;

    gBoard[i][j].isShown = true;
    elCell.classList.add('shown');
    //changes start
    var elSpanInCell = elCell.querySelector('span');
    if (gBoard[i][j].isMine) {
        elSpanInCell.innerText = gMine;
        elSpanInCell.classList.add('shown');
        gLives--;
        // to give support for lives counting this as a mark so the player could win the game:
        gMarkedCorrectly++;
        gGame.shownCount--;
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        updateLives()
        checkGameOver();
        return;
    }
    else if (gBoard[i][j].minesAroundCount !== 0) elSpanInCell.innerText = gBoard[i][j].minesAroundCount;
    else elSpanInCell.innerText = '';
    // changes finish
    var elSpanInCell = elCell.querySelector('span');
    elSpanInCell.classList.add('shown');
    if (gBoard[i][j].isMine) {
        gLives--;
        updateLives()
        checkGameOver();
        return;
    }
    checkGameOver();
}

// Called on right click to mark a 
// cell (suspected to be a mine)
// Search the web (and 
// implement) how to hide the 
// context menu on right click

function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isShown) return;
    if (!gGame.isOn) startTimer();

    gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
    var elSpanInCell = elCell.querySelector('span');
    elSpanInCell.classList.toggle('marked');

    if (!gBoard[i][j].isMarked && gBoard[i][j].minesAroundCount !== 0) {
        elSpanInCell.innerText = gBoard[i][j].minesAroundCount;
    } else if (gBoard[i][j].isMarked) elSpanInCell.innerText = gFlag;
    else elSpanInCell.innerText = '';

    if (gBoard[i][j].isMine && gBoard[i][j].isMarked) gMarkedCorrectly++;
    if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) gMarkedCorrectly--;

    checkGameOver();

}

// Game ends when all mines are 
// marked, and all the other cells 
// are shown

function checkGameOver() {
    var totalCells = ((gLevel.SIZE ** 2) - gLevel.MINES);
    if (gLives === 0) {
        showMines();
        stopTimer();
        alert('YOU LOST!');
    } else if (gGame.shownCount === totalCells && gMarkedCorrectly === gLevel.MINES) {
        stopTimer();
        alert('YOU WON!');
    }

}

// When user clicks a cell with no 
// mines around, we need to open 
// not only that cell, but also its 
// neighbors. 
// NOTE: start with a basic 
// implementation that only opens 
// the non-mine 1st degree 
// neighbors
// BONUS: if you have the time 
// later, try to work more like the 
// real algorithm (see description 
// at the Bonuses section below)


function expandShown(board, elCell, i, j) {

}


function startTimer() {

    gGame.isOn = true;
    var elTimer = document.querySelector('.timer');
    var start = Date.now();
    gTimerInterval = setInterval(() => {
        elTimer.innerText = ((Date.now() - start) / 1000);
    }, 100);
}

function stopTimer() {
    clearInterval(gTimerInterval);
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '';
    gGame.isOn = false;
}

function showMines() {
    for (var i = 0; i < gMinesCoords.length; i++) {
        var coords = gMinesCoords[i];
        var elCell = document.querySelector(`#cell-${coords.i}-${coords.j}`);
        var elSpan = elCell.querySelector('span');
        elCell.classList.add('shown');
        elSpan.classList.add('shown');
    }
}

function changeDifficulty(elBtn, size, mines) {

    gLevel.MINES = mines;
    gLevel.SIZE = size;

    elBtn.classList.add('shown');
    var elBtns = document.querySelectorAll('button')
    for (var i = 0; i < elBtns.length; i++) {
        var currBtn = elBtns[i];
        if (currBtn === elBtn) continue;
        currBtn.classList.remove('shown');
    }

    init();


}

function updateLives() {
    var elspan = document.querySelector('h2 span');
    console.log(elspan);
    elspan.innerText = gLives;
}


// renderCell(){

// }
