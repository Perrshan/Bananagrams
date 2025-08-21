const gameBoardSize = 101; // 21x21 grid must be odd number
const playerTylesSize = 21; // 21 tiles for the player

// Initialize the tiles array with the specified distribution
var tyles = [
    ...Array(13).fill("A"),
    ...Array(3).fill("B"),
    ...Array(3).fill("C"),
    ...Array(6).fill("D"),
    ...Array(18).fill("E"),
    ...Array(3).fill("F"),
    ...Array(4).fill("G"),
    ...Array(3).fill("H"),
    ...Array(12).fill("I"),
    ...Array(2).fill("J"),
    ...Array(2).fill("K"),
    ...Array(5).fill("L"),
    ...Array(3).fill("M"),
    ...Array(8).fill("N"),
    ...Array(11).fill("O"),
    ...Array(3).fill("P"),
    ...Array(2).fill("Q"),
    ...Array(9).fill("R"),
    ...Array(6).fill("S"),
    ...Array(9).fill("T"),
    ...Array(6).fill("U"),
    ...Array(3).fill("V"),
    ...Array(3).fill("W"),
    ...Array(2).fill("X"),
    ...Array(3).fill("Y"),
    ...Array(2).fill("Z")
]

var playerTyles = []

for (let i = 0; i < playerTylesSize; i++) {
    playerTyles.push(getRandomTyle());
}

// fill the game board grid with empty strings to represent no tiles placed
var gameBoardGrid = Array(gameBoardSize*gameBoardSize).fill("");


// initialize state variables and set gameboard as just the center tile
var selectedTyle = "";
var selectedTyleIndex = -1;
var topMostRow = ((gameBoardSize-1)/2) + 1;
var bottomMostRow = ((gameBoardSize-1)/2) + 1;
var leftMostColumn = ((gameBoardSize-1)/2) + 1;
var rightMostColumn = ((gameBoardSize-1)/2) + 1;
var dictionaryCreated = false;


console.log("Creating dictionary...");

let dictionary = new Set();
var invalidWords = [];

fetch('words_alpha.txt')
.then(response => response.text())
.then(text => {
    const words = text.split('\n');
    for (let word of words) {
    dictionary.add(word.trim().toLowerCase());
    }
}). then (console.log("Dictionary created!"));


// retrieves random tile from tyles array, removes it from the array, and returns it
function getRandomTyle() {
    if (tyles.length === 0) {
        alert("No more tiles available!");
        return null;
    }
    const randomIndex = Math.floor(Math.random() * tyles.length);
    const randomTyle = tyles[randomIndex];
    tyles.splice(randomIndex, 1); // Remove the selected tile from the array
    return randomTyle;
}

// sorts player's tiles alphabetically
function sortTyles() {
    playerTyles.sort(); // Sort the player's tiles alphabetically
}

// gives player one new random tile from the pool of tiles
function peel() {
    if (tyles.length === 0) {
        alert("No more tiles available to peel!");
        return;
    }
    const newTyle = getRandomTyle();
    if (newTyle) {
        playerTyles.push(newTyle);
        displayPlayerTyles();
    }
}

// discards the selected tile and replaces it with three new random tiles from the pool of tiles
function dump() {
    if (selectedTyleIndex === -1) {
        alert("No tile selected to dump!");
        return;
    }
    const dumpedTyle = playerTyles[selectedTyleIndex];
    playerTyles.splice(selectedTyleIndex, 1); // Remove the selected tile from the player's tiles
    selectedTyle = "";
    selectedTyleIndex = -1;
    displaySelectedTyle();
    for (let i = 0; i <3; i++) {
        if (tyles.length === 0) {
            alert("No more tiles available to dump!");
            break;
        }
        const newTyle = getRandomTyle();
        if (newTyle) {
            playerTyles.push(newTyle);
        }
    }
    tyles.push(dumpedTyle); // Add the dumped tile back to the pool of tiles
}

// Helper functions to get the topmost, bottommost, leftmost, and rightmost rows/columns with tiles
// These functions will help in displaying the game board correctly by only showing the relevant part of the grid
// They will return the index of the row/column that contains the first tile in that direction
function getTopMostRow(gameBoardGrid) {
    let topMostRow = -1;
    for (let i = 0; i < gameBoardSize; i++) {
        for (let j = 0; j < gameBoardSize; j++) {
            const index = i * gameBoardSize + j;
            if (gameBoardGrid[index] !== "") {
                topMostRow = i-1;
                break;
            }
        }
        if (topMostRow !== -1) {
            break;
        }
    }

    if (topMostRow === -1) {
        topMostRow = ((gameBoardSize-1)/2);
    }
    return topMostRow;
}

function getBottomMostRow(gameBoardGrid) {
    let bottomMostRow = -1;
    for (let i = gameBoardSize - 1; i >= 0; i--) {
        for (let j = 0; j < gameBoardSize; j++) {
            const index = i * gameBoardSize + j;
            if (gameBoardGrid[index] !== "") {
                bottomMostRow = i+1;
                break;
            }
        }
        if (bottomMostRow !== -1) {
            break;
        }
    }

    if (bottomMostRow === -1) {
        bottomMostRow = ((gameBoardSize-1)/2);
    }
    return bottomMostRow;
}

function getLeftMostColumn(gameBoardGrid) {
    let leftMostColumn = -1;
    for (let j = 0; j < gameBoardSize; j++) {
        for (let i = 0; i < gameBoardSize; i++) {
            const index = i * gameBoardSize + j;
            if (gameBoardGrid[index] !== "") {
                leftMostColumn = j-1;
                break;
            }
        }
        if (leftMostColumn !== -1) {
            break;
        }
    }

    if (leftMostColumn === -1) {
        leftMostColumn = ((gameBoardSize-1)/2);
    }
    return leftMostColumn;
}

function getRightMostColumn(gameBoardGrid) {
    let rightMostColumn = -1;
    for (let j = gameBoardSize - 1; j >= 0; j--) {
        for (let i = 0; i < gameBoardSize; i++) {
            const index = i * gameBoardSize + j;
            if (gameBoardGrid[index] !== "") {
                rightMostColumn = j+1;
                break;
            }
        }
        if (rightMostColumn !== -1) {
            break;
        }
    }

    if (rightMostColumn === -1) {
        rightMostColumn = ((gameBoardSize-1)/2);
    }
    return rightMostColumn;
}


//displayBoard function generates the HTML for the game board based on the current state of gameBoardGrid
function displayBoard() {

    var topMostRow = getTopMostRow(gameBoardGrid);
    var bottomMostRow = getBottomMostRow(gameBoardGrid);
    var leftMostColumn = getLeftMostColumn(gameBoardGrid);
    var rightMostColumn = getRightMostColumn(gameBoardGrid);

    let boardHTML = "<table>";
    if (getTopMostRow(gameBoardGrid) == ((gameBoardSize-1)/2)) {
        boardHTML += "<tr>";
        const index = getTopMostRow(gameBoardGrid) * gameBoardSize + getLeftMostColumn(gameBoardGrid);
        boardHTML += `<td id="cell-${index}" onclick="handleCellClick(${index})">${gameBoardGrid[index]}</td>`;
        boardHTML += "</tr>";
    } else {
        for (let i = topMostRow; i <= bottomMostRow; i++) {
            boardHTML += "<tr>";
            for (let j = leftMostColumn; j <= rightMostColumn; j++) {
                const index = i * gameBoardSize + j;
                boardHTML += `<td id="cell-${index}" onclick="handleCellClick(${index})">${gameBoardGrid[index]}</td>`;
            }
            boardHTML += "</tr>";
        }
    }
    boardHTML += "</table>";
    document.getElementById("game-board").innerHTML = boardHTML;

    for (let i = topMostRow; i <= bottomMostRow; i++) {
        for (let j = leftMostColumn; j <= rightMostColumn; j++) {
            const index = i * gameBoardSize + j;
            const cell = document.getElementById(`cell-${index}`);

            if (gameBoardGrid[index] === "") {
                cell.classList.remove("filled-cell");
                cell.classList.add("empty-cell");
            } else {
                cell.classList.remove("empty-cell");
                cell.classList.add("filled-cell");
            }
        }
    }
}

// displayPlayerTyles function generates the HTML for the player's tiles based on the current state of playerTyles
function displayPlayerTyles() {

    var tyleCount = playerTyles.length;
    var i = 0
    var rownum = 1
    let playerTylesHTML = "<table>";

    while (i < tyleCount) {

        if (i - 11*rownum == -11) {
            playerTylesHTML += "<tr>";
        }
        else if (i - 11*rownum == 0) {
            rownum ++;
            playerTylesHTML += "</tr>";
        }
        playerTylesHTML += `<td id="player-cell-${i}" onclick="selectNewTyle(${i})">${playerTyles[i]}</td>`;

        i ++;
    }
    playerTylesHTML += "</tr>";
    playerTylesHTML += "</table>";
    document.getElementById("player-tyles").innerHTML = playerTylesHTML;

}

// displaySelectedTyle function generates the HTML for the selected tile based on the current state of selectedTyle and selectedTyleIndex
function displaySelectedTyle() {
    let selectedTyleHTML = "<table>";

    selectedTyleHTML += "<tr>";
    selectedTyleHTML += `<td id="selected_tyle">${selectedTyle}</td>`;
    selectedTyleHTML += "</tr>";

    selectedTyleHTML += "</table>";

    cell = document.getElementById("selected-tyle");
    cell.innerHTML = selectedTyleHTML;

    if (selectedTyleIndex === -1) {
        cell.classList.remove("filled-cell");
        cell.classList.add("empty-cell");
    } else {
        cell.classList.remove("empty-cell");
        cell.classList.add("filled-cell");
    }
}



// Event listeners

// Start game button initializes the game board and player tiles
document.getElementById("start-game").addEventListener("click", function() {

    tyles = [
        ...Array(13).fill("A"),
        ...Array(3).fill("B"),
        ...Array(3).fill("C"),
        ...Array(6).fill("D"),
        ...Array(18).fill("E"),
        ...Array(3).fill("F"),
        ...Array(4).fill("G"),
        ...Array(3).fill("H"),
        ...Array(12).fill("I"),
        ...Array(2).fill("J"),
        ...Array(2).fill("K"),
        ...Array(5).fill("L"),
        ...Array(3).fill("M"),
        ...Array(8).fill("N"),
        ...Array(11).fill("O"),
        ...Array(3).fill("P"),
        ...Array(2).fill("Q"),
        ...Array(9).fill("R"),
        ...Array(6).fill("S"),
        ...Array(9).fill("T"),
        ...Array(6).fill("U"),
        ...Array(3).fill("V"),
        ...Array(3).fill("W"),
        ...Array(2).fill("X"),
        ...Array(3).fill("Y"),
        ...Array(2).fill("Z")
    ]

    playerTyles = []

    for (let i = 0; i < 21; i++) {
        playerTyles.push(getRandomTyle());
    }

    gameBoardGrid = Array(gameBoardSize*gameBoardSize).fill("");
    selectedTyleIndex = -1;
    selectedTyle = "";
    displayBoard();
    displaySelectedTyle();
    displayPlayerTyles();

    alert("Game started! SPLIT!");
})


// Event listeners for buttons to peel, sort, dump, and declare bananas
document.getElementById("peel").addEventListener("click", function() {
    peel();
    displayPlayerTyles();
});

document.getElementById("sort").addEventListener("click", function() {
    sortTyles();
    displayPlayerTyles();
});

document.getElementById("dump").addEventListener("click", function() {
    dump();
    displayPlayerTyles();
});

document.getElementById("bananas").addEventListener("click", function() {
    if (playerTyles.length !== 0) {
        alert("You have not used all your tiles yet! You cannot declare BANANAS!");
        return;
    }

    var tyle = "";
    var index = 0;
    var tylesOnBoardCount = gameBoardGrid.filter(t => t !== "").length;

    // find first non-empty tile on the board
    while (tyle === "") {
        tyle = gameBoardGrid[index];
        if (tyle === "") {
            index++;
        } 
    }
    
    // check if all tiles on the board are connected
    var connectedTylesCount = countConnectedTiles(gameBoardGrid, gameBoardSize, gameBoardSize, Math.floor(index/gameBoardSize), index % gameBoardSize, new Set());
    
    if (connectedTylesCount !== tylesOnBoardCount) {
        alert("All tiles must be connected! You cannot declare BANANAS!");
        return;
    }

    // initialize variables to track words formed
    var wordsFormed = [];
    var word = "";


    gameBoardGrid.forEach((tile, index) => {

        tyleDistance = 1;

        // Check to see if tyle is beginning of a row or column
        var tileLeft = gameBoardGrid[index-1];
        var tileTop = gameBoardGrid[index-gameBoardSize];
        var tileRight = gameBoardGrid[index+tyleDistance];
        var tileBottom = gameBoardGrid[index+gameBoardSize];

        // Check to see if the tile is the start of a word horizontally
        if (tile !== "" && (tileLeft === "" && tileRight !== "")) {
            word = tile;
            word += tileRight;
            tyleDistance++;
            tileRight = gameBoardGrid[index+tyleDistance];
            while (tileRight !== "" && tileRight !== undefined) {
                word += tileRight;
                tyleDistance++;
                tileRight = gameBoardGrid[index+tyleDistance];
            }
            wordsFormed.push(word);
        }

        // Check to see if the tile is the start of a word vertically
        if (tile !== "" && (tileTop === "" && tileBottom !== "")) {
            tyleDistance = 1;
            word = tile;
            word += tileBottom;
            tyleDistance++;
            tileBottom = gameBoardGrid[index+(gameBoardSize*tyleDistance)];
            while (tileBottom !== "" && tileBottom !== undefined) {
                word += tileBottom;
                tyleDistance++;
                tileBottom = gameBoardGrid[index+(gameBoardSize*tyleDistance)];
            }
            wordsFormed.push(word);
        }
        
    });

    // checks if all words formed are valid according to the dictionary
    wordsFormed.forEach(word => {
        if (!dictionary.has(word.toLowerCase())) {
            invalidWords.push(word);
        } 
    });

    if (invalidWords.length > 0) {
        var invalidWordsString = invalidWords.join(", ");
        alert(`${invalidWordsString} are invalid word(s)! You cannot declare BANANAS! `);
        return;
    } else {

        // all tests are passed, so the player can declare BANANAS
        alert("Congratulations! You win!!! Go BANANAS!!");
    }
});

// recursive function to count connected tiles
// It uses a depth-first search approach to traverse the grid and count connected tiles
function countConnectedTiles(grid, rows, cols, row, col, visited) {
  // Check boundaries
  if (row < 0 || col < 0 || row >= rows || col >= cols) return 0;

  const index = row * cols + col;

  // If already visited or empty, return 0
  if (visited.has(index) || grid[index] === "") return 0;

  visited.add(index); // Mark this tile as visited

  // Count current tile + recurse in 4 directions
  return 1 +
    countConnectedTiles(grid, rows, cols, row - 1, col, visited) + // Up
    countConnectedTiles(grid, rows, cols, row + 1, col, visited) + // Down
    countConnectedTiles(grid, rows, cols, row, col - 1, visited) + // Left
    countConnectedTiles(grid, rows, cols, row, col + 1, visited);  // Right
}

// Function to handle cell click events on the game board
function handleCellClick(index) {
    const cell = document.getElementById(`cell-${index}`);
    if (selectedTyleIndex === -1) {
        if (cell.innerHTML === "") {
                alert("No tile to return in this cell!");
                return;
            }

        var returnTyle = confirm(`Do you want to return the ${cell.innerHTML} tile from the board?`);

        if (returnTyle) {
            const existingTyle = cell.innerHTML;
            playerTyles.push(existingTyle); // Add the tile back to player's tiles
            gameBoardGrid[index] = ""; // Clear the cell in the game board array
            cell.innerHTML = ""; // Clear the cell in the UI
            displayPlayerTyles();
            displayBoard();
        }
    } else {
        if (cell.innerHTML === "") {
            cell.innerHTML = selectedTyle; 
            gameBoardGrid[index] = selectedTyle;
            playerTyles.splice(selectedTyleIndex, 1);
        }
        else {

            var replaceTyl = confirm("Do you want to replace the existing tile with the selected tile?");
            if (replaceTyl) {
                var existingTyle = cell.innerHTML;
                cell.innerHTML = selectedTyle; // Replace the existing tile with the selected tile
                gameBoardGrid[index] = selectedTyle;
                playerTyles.splice(selectedTyleIndex, 1);
                playerTyles.push(existingTyle); // Add the replaced tile back to player's tiles
            }
        }
        selectedTyle = "";
        selectedTyleIndex = -1;
        displayPlayerTyles();
        displaySelectedTyle();
        displayBoard();
    }

}

// Function to select a new tile from the player's tiles
// It updates the selectedTyle and selectedTyleIndex variables and displays the selected tile
function selectNewTyle(index) {
    const cell = document.getElementById(`player-cell-${index}`);
    selectedTyle = cell.innerHTML;
    selectedTyleIndex = index;
    displaySelectedTyle();
}

displayBoard();
displaySelectedTyle();
displayPlayerTyles();
