'use strict'

var gBoard;

var gMine = '💣';
var gFlag = '🚩';

var gLives = 3;
var gMarkedCorrectly = 0;


var gHints = 3;
var gHintIsPressed = false;

var gFirstClick = true;

var gMinesCoords;

var gTime;
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
    gHints = 3;
    gHintIsPressed = false;
    gFirstClick = true;
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



function placeMinesRandomly(num, board, firstCellI, firstCellJ) {

    for (var i = 0; i < num; i++) {
        var currCell = board[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)];
        while (currCell.isMine || currCell === board[firstCellI][firstCellJ]) {
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

function firstClickSetup(coordI, coordJ) {
    placeMinesRandomly(gLevel.MINES, gBoard, coordI, coordJ);
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
    if (!gGame.isOn && gGame.shownCount !== 0) return;
    if (!gGame.isOn) startTimer();

    if (gFirstClick) {
        firstClickSetup(i, j);
        gFirstClick = false;
    }

    if (gHintIsPressed) {
        revealHintedCell(elCell, i, j);
        gHintIsPressed = false;
        return;
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
        updateSmiley('hurt');
        updateLives()
        checkGameOver();
        return;
    }
    else if (gBoard[i][j].minesAroundCount !== 0) elSpanInCell.innerText = gBoard[i][j].minesAroundCount;
    else elSpanInCell.innerText = '';
    // changes finish
    var elSpanInCell = elCell.querySelector('span');
    elSpanInCell.classList.add('shown');
    // if (gBoard[i][j].isMine) {
    //     gLives--;
    //     updateLives()
    //     checkGameOver();
    //     return;
    // }
    updateSmiley();
    checkGameOver();
}

// Called on right click to mark a 
// cell (suspected to be a mine)
// Search the web (and 
// implement) how to hide the 
// context menu on right click

function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isShown) return;
    if (!gGame.isOn && gGame.shownCount !== 0) return;
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
        updateSmiley('dead');
        showMines();
        stopTimer();
        alert('YOU LOST!');
    } else if (gGame.shownCount === totalCells && gMarkedCorrectly === gLevel.MINES) {
        updateSmiley('win');
        stopTimer();
        if (gTime < localStorage.getItem(`BestScore-${gLevel.SIZE}X${gLevel.SIZE}`) || localStorage.getItem(`BestScore-${gLevel.SIZE}X${gLevel.SIZE}`) === null) {
            localStorage.setItem(`BestScore-${gLevel.SIZE}X${gLevel.SIZE}`, gTime);
        }
        alert('YOU WON!');
    }
    return;
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
    // if()

}


function startTimer() {

    gGame.isOn = true;
    var elTimer = document.querySelector('.timer');
    var start = Date.now();
    gTimerInterval = setInterval(() => {
        gTime = ((Date.now() - start) / 1000);
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
        elSpan.innerText = gMine;
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
    restart();
}

function updateLives() {
    var elspan = document.querySelector('h2 span');
    console.log(elspan);
    elspan.innerText = gLives;
}

function updateSmiley(status) {
    var elH3 = document.querySelector('h3');
    var elSpanInH3 = elH3.querySelector('span');
    switch (status) {
        case 'dead':
            elSpanInH3.innerText = '💀';
            break;
        case 'win':
            elSpanInH3.innerText = '😎';
            break;
        case 'hurt':
            elSpanInH3.innerText = '😥';
            break;
        default:
            elSpanInH3.innerText = '😀';
    }
}

function restart() {
    stopTimer();
    displayHints();
    displaySafePicks();
    init();
}

function showHint(elHint) {

    if (gHints === 0) return;
    elHint.style.display = 'none';
    gHintIsPressed = true;
    gHints--;
}

function revealHintedCell(elCell, cellI, cellJ) {
    var shownCells = [];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            // var clickedAlready = gBoard[i][j].isShown;
            if (gBoard[i][j].isShown) continue;
            // var markedAlready = gBoard[i][j].isMarked;
            if (gBoard[i][j].isMarked) continue;
            shownCells.push({ i: i, j: j })
            renderCell(gBoard[i][j], i, j);
        }
    }
    // console.log(shownCells);
    setTimeout(() => {
        for (var i = 0; i < shownCells.length; i++) {
            // console.log(gBoard[i][j]);
            gBoard[shownCells[i].i][shownCells[i].j].isShown = false;
            var elCell = document.querySelector(`#cell-${shownCells[i].i}-${shownCells[i].j}`);
            var elSpan = elCell.querySelector('span');
            elCell.classList.remove('shown');
            elSpan.classList.remove('shown');
        }

    }, 1000);

}

function displayHints() {
    var hints = document.querySelectorAll('.hints span');
    for (var i = 0; i < hints.length; i++) {
        hints[i].style.display = 'inline';
    }
}

function showSafe(elSpan) {
    elSpan.style.display = 'none';
    var safePicks = [];
    var elCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isMine && !currCell.isShown) {
                safePicks.push(currCell);
                var elCell = document.querySelector(`#cell-${i}-${j}`);
                elCells.push(elCell);
            }
        }
    }
    var idx = getRandomInt(0, safePicks.length);
    if (elCells.length === 0) return;
    // elCells[idx].style.backgroundColor = 'blue';
    elCells[idx].classList.add('bolded');
    setTimeout(() => {
        // elCells[idx].style.backgroundColor = 'deeppink';
        elCells[idx].classList.remove('bolded');
    }, 1500);


}
function displaySafePicks() {
    var safePicks = document.querySelectorAll('.safeClicks span');
    for (var i = 0; i < safePicks.length; i++) {
        safePicks[i].style.display = 'inline';
    }
}



function renderCell(cell, cellI, cellJ) {
    if (cell.isShown) return;
    cell.isShown = true;
    var elCell = document.querySelector(`#cell-${cellI}-${cellJ}`);
    var elSpan = elCell.querySelector('span');
    elCell.classList.add('shown');
    elSpan.classList.add('shown');
    if (cell.isMine) elSpan.innerText = gMine;
    else if (cell.minesAroundCount !== 0) elSpan.innerText = cell.minesAroundCount;
    else elSpan.innerText = '';

}
