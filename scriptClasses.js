const button = document.getElementById("start-game");
const gameBoardSize = 101; // 21x21 grid must be odd number
const playerTylesSize = 3; // 21 tiles for the player

class GameBoard {
    constructor(size) {
        this.size = size;
        this.grid = Array(size * size).fill("");
    }

    getTopMostRow() {
    let topMostRow = -1;
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            const index = i * this.size + j;
            if (this.grid[index] !== "") {
                topMostRow = i-1;
                break;
            }
        }
        if (topMostRow !== -1) {
            break;
        }
    }

    if (topMostRow === -1) {
        topMostRow = ((this.size-1)/2);
    }
    return topMostRow;
    }

    getBottomMostRow() {
        let bottomMostRow = -1;
        for (let i = this.size - 1; i >= 0; i--) {
            for (let j = 0; j < this.size; j++) {
                const index = i * this.size + j;
                if (this.grid[index] !== "") {
                    bottomMostRow = i+1;
                    break;
                }
            }
            if (bottomMostRow !== -1) {
                break;
            }
        }

        if (bottomMostRow === -1) {
            bottomMostRow = ((this.size-1)/2);
        }
        return bottomMostRow;
    }

    getLeftMostColumn() {
        let leftMostColumn = -1;
        for (let j = 0; j < this.size; j++) {
            for (let i = 0; i < this.size; i++) {
                const index = i * this.size + j;
                if (this.grid[index] !== "") {
                    leftMostColumn = j-1;
                    break;
                }
            }
            if (leftMostColumn !== -1) {
                break;
            }
        }

        if (leftMostColumn === -1) {
            leftMostColumn = ((this.size-1)/2);
        }
        return leftMostColumn;
    }

    getRightMostColumn() {
        let rightMostColumn = -1;
        for (let j = this.size - 1; j >= 0; j--) {
            for (let i = 0; i < this.size; i++) {
                const index = i * this.size + j;
                if (this.grid[index] !== "") {
                    rightMostColumn = j+1;
                    break;
                }
            }
            if (rightMostColumn !== -1) {
                break;
            }
        }

        if (rightMostColumn === -1) {
            rightMostColumn = ((this.size-1)/2);
        }
        return rightMostColumn;
    }

    displayBoard() {

        let boardHTML = "<table>";
        if (this.getTopMostRow() == ((this.size-1)/2)) {
            boardHTML += "<tr>";
            const index = this.getTopMostRow() * this.size + this.getLeftMostColumn();
            boardHTML += `<td id="cell-${index}" onclick="handleCellClick(${index})">${this.grid[index]}</td>`;
            boardHTML += "</tr>";
        } else {
            for (let i = this.getTopMostRow(); i <= this.getBottomMostRow(); i++) {
                boardHTML += "<tr>";
                for (let j = this.getLeftMostColumn(); j <= this.getRightMostColumn(); j++) {
                    const index = i * this.size + j;
                    boardHTML += `<td id="cell-${index}" onclick="handleCellClick(${index})">${this.grid[index]}</td>`;
                }
                boardHTML += "</tr>";
            }
        }
        boardHTML += "</table>";
        document.getElementById("game-board").innerHTML = boardHTML;

        for (let i = this.getTopMostRow(); i <= this.getBottomMostRow(); i++) {
            for (let j = this.getLeftMostColumn(); j <= this.getRightMostColumn(); j++) {
                const index = i * this.size + j;
                const cell = document.getElementById(`cell-${index}`);

                if (this.grid[index] === "") {
                    cell.classList.remove("filled-cell");
                    cell.classList.add("empty-cell");
                } else {
                    cell.classList.remove("empty-cell");
                    cell.classList.add("filled-cell");
                }
            }
        }
    }
}

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

var gameBoardGrid = new GameBoard(gameBoardSize);

var playerTyles = []

for (let i = 0; i < playerTylesSize; i++) {
    playerTyles.push(getRandomTyle());
}

var selectedTyle = "";
var selectedTyleIndex = -1;

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

function sortTyles() {
    playerTyles.sort(); // Sort the player's tiles alphabetically
}

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

document.getElementById("start-game").addEventListener("click", function() {

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

    playerTyles = []

    for (let i = 0; i < 21; i++) {
        playerTyles.push(getRandomTyle());
    }

    gameBoardGrid = Array(gameBoardSize*gameBoardSize).fill("");
    selectedTyleIndex = -1;
    selectedTyle = "";
    gameBoardGrid.displayBoard();
    displaySelectedTyle();
    displayPlayerTyles();

    alert("Game started! SPLIT!");
})

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

    while (tyle === "") {
        tyle = gameBoardGrid[index];
        if (tyle === "") {
            index++;
        } 
    }
    
    var connectedTylesCount = countConnectedTiles(gameBoardGrid, gameBoardSize, gameBoardSize, Math.floor(index/gameBoardSize), index % gameBoardSize, new Set());
    
    if (connectedTylesCount !== tylesOnBoardCount) {
        alert("All tiles must be connected! You cannot declare BANANAS!");
        return;
    }

    var wordsFormed = [];
    var word = "";

    gameBoardGrid.forEach((tile, index) => {

        tyleDistance = 1;

        // Check to see if tyle is beginning of a row or column
        tileLeft = gameBoardGrid[index-1];
        tileTop = gameBoardGrid[index-gameBoardSize];

        // Follow tyles to see what word was formed
        tileRight = gameBoardGrid[index+tyleDistance];
        tileBottom = gameBoardGrid[index+gameBoardSize];

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

    console.log("Words formed:", wordsFormed);

    let dictionary = new Set();

    var invalidWords = [];

    fetch('words_alpha.txt')
    .then(response => response.text())
    .then(text => {
        const words = text.split('\n');
        for (let word of words) {
        dictionary.add(word.trim().toLowerCase());
        }
        console.log("Dictionary loaded:", dictionary.size, "words");

        wordsFormed.forEach(word => {
        if (dictionary.has(word.toLowerCase())) {
            console.log(`"${word.toLowerCase()}" is a valid word!`);
        } else {
            console.log(`"${word.toLowerCase()}" is NOT a valid word!`);
            invalidWords.push(word);
        }
        });

        console.log("Invalid words:", invalidWords);

        if (invalidWords.length > 0) {
            var invalidWordsString = invalidWords.join(", ");
            alert(`${invalidWordsString} are invalid word(s)! You cannot declare BANANAS! `);
            return;
        } else {
            alert("Congratulations! You win!!! Go BANANAS!!");
        }
    });

});

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
            gameBoardGrid.grid[index] = ""; // Clear the cell in the game board array
            cell.innerHTML = ""; // Clear the cell in the UI
            displayPlayerTyles();
            gameBoardGrid.displayBoard();
        }
    } else {
        if (cell.innerHTML === "") {
            cell.innerHTML = selectedTyle; // Example action: place an "X" in the clicked cell
            gameBoardGrid.grid[index] = selectedTyle; // Update the game board array
            playerTyles.splice(selectedTyleIndex, 1);
        }
        else {

            var replaceTyl = confirm("Do you want to replace the existing tile with the selected tile?");
            if (replaceTyl) {
                var existingTyle = cell.innerHTML;
                cell.innerHTML = selectedTyle; // Replace the existing tile with the selected tile
                gameBoardGrid.grid[index] = selectedTyle; // Update the game board array
                playerTyles.splice(selectedTyleIndex, 1);
                playerTyles.push(existingTyle); // Add the replaced tile back to player's tiles
            }
        }
        selectedTyle = "";
        selectedTyleIndex = -1;
        displayPlayerTyles();
        displaySelectedTyle();
        gameBoardGrid.displayBoard();
    }

}

function selectNewTyle(index) {
    const cell = document.getElementById(`player-cell-${index}`);
    selectedTyle = cell.innerHTML;
    selectedTyleIndex = index;
    displaySelectedTyle();
}

gameBoardGrid.displayBoard();
displaySelectedTyle();
displayPlayerTyles();
