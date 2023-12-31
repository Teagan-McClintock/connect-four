"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
// (board[5][0] would be the bottom-left spot on the board)

/** makeBoard: fill in global `board`:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  //  set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {

    let row = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");

  // generates top row to place chips
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");

  // Creates clickable buttons for each cell in the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", `top-${x}`); // makes id for each button
    headCell.addEventListener("click", handleClick);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {

    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) {

      const cell = document.createElement('td');

      cell.setAttribute('id', `c-${y}-${x}`);

      row.append(cell);

    }

    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return y coordinate of furthest-down spot
 *    (return null if filled) */

function findSpotForCol(x) {
  for (let y = 5; y >= 0; y--)
  {
    if (board[y][x] === null){
      return y;
    }
  }
  return null;
}


/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {

  const foundCell = document.getElementById(`c-${y}-${x}`);
  const chip = document.createElement('div');
  chip.classList.add('piece');
  chip.classList.add(`p${currPlayer}`);
  foundCell.appendChild(chip);
}


/** checkForWin: check board cell-by-cell for "does a win start here?"
 * and return true if so otherwise false
*/

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    for (let cell of cells) {

      let y = cell[0];
      let x = cell[1];

      // check if piece is legal and player is right
      let isLegal = !(y > HEIGHT - 1 || y < 0 || x > WIDTH - 1 || x < 0);
      if (!isLegal) {
        return false;
      }

      let currentPlayer = board[y][x];
      if (!(currentPlayer === currPlayer)){
        return false;
      }

    }
    return true;

  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {

      // generates possible places to check for wins
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
  return false;
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = Number(evt.target.id.slice("top-".length));

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }


  // check for tie: if top row is filled, board is filled
  let boardFilled = false;
  for (let row of board) {
    if (row.every(cell => cell !== null)) {
      boardFilled = true;
    }
  }
  if (boardFilled) {
    endGame("It's a tie.");
  }

  // switch players
  currPlayer = (currPlayer === 1) ? 2 : 1;
}

/** Start game. */
function start() {
  makeBoard();
  makeHtmlBoard();
}

start();