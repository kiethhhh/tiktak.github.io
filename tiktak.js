document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('board');
    const categoryDropdown = document.getElementById('category');
    const playersDropdown = document.getElementById('players');
    const resetButton = document.getElementById('resetButton'); // Add the reset button
    const sizeX = 5;
    const sizeY = 6;
    const winningScores = {
        'horizontal': 6,
        'vertical': 5,
        'diagonal': [2, 3, 4, 5] 
    };
    let currentPlayer = 'X';
    let scores = {
        'X': 0,
        'O': 0
    };

    // Initialize the game
    createBoard();
    resetGame();

    function createBoard() {
        for (let i = 0; i < sizeY; i++) {
            for (let j = 0; j < sizeX; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleCellClick);
                board.appendChild(cell);
            }
        }
    }

    function resetGame() {
        resetBoard();
        resetScores();
    }

    function resetBoard() {
        const cells = document.querySelectorAll('.cell');
        for (const cell of cells) {
            cell.textContent = '';
        }
    }

    function resetScores() {
        scores['X'] = 0;
        scores['O'] = 0;
        updateScores();
    }

    function updateScores() {
        // Assuming you have elements with ids 'scoreX' and 'scoreO' in your HTML
        document.getElementById('scoreX').textContent = scores['X'];
        document.getElementById('scoreO').textContent = scores['O'];
    
        // Check if a player has reached 5 points
        if (scores[currentPlayer] >= 5) {
            alert(`Congratulations! Player ${currentPlayer} has reached 5 points!`);
            resetGame();
        }
    }
    

    function handleCellClick(event) {
        const clickedCell = event.target;
        const row = clickedCell.dataset.row;
        const col = clickedCell.dataset.col;
    
        // Check if the cell is empty
        if (!clickedCell.textContent) {
            // Update the cell with the current player
            clickedCell.textContent = currentPlayer;
    
            // Check for a winner
            if (checkWinner(parseInt(row), parseInt(col))) {
                alert(`Player ${currentPlayer} wins!`);
    
                // Delay the reset to show the winning move
                setTimeout(function () {
                    scores[currentPlayer]++;
                    updateScores();
                    resetBoard();
                }, 1000); // Adjust the delay time as needed
            } else if (checkDraw()) {
                alert("It's a draw!");
                updateScores();
                resetBoard();
            } else {
                // Switch to the next player
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
                // If the next player is AI, make an automatic move
                if (currentPlayer === 'O' && playersDropdown.value === 'AIvsHuman') {
                    makeAIMove();
                }
    
                // Check for points based on connecting blocks
                if (checkPoints(parseInt(row), parseInt(col))) {
                    return; // Return early to prevent calling checkPoints again
                }
            }
        }
    }
    
    

    function checkEdgeToEdge(row, col, rowDelta, colDelta, direction) {
        const player = currentPlayer;
        let count = 1; // Count the current cell
    
        // Check in one direction
        for (let i = 1; i < Math.max(sizeY, sizeX); i++) {
            const newRow = row + i * rowDelta;
            const newCol = col + i * colDelta;
    
            // Break if out of bounds or different player
            if (newRow < 0 || newRow >= sizeY || newCol < 0 || newCol >= sizeX || board.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`).textContent !== player) {
                break;
            }
    
            count++;
        }
    
        // Check in the opposite direction
        for (let i = 1; i < Math.max(sizeY, sizeX); i++) {
            const newRow = row - i * rowDelta;
            const newCol = col - i * colDelta;
    
            // Break if out of bounds or different player
            if (newRow < 0 || newRow >= sizeY || newCol < 0 || newCol >= sizeX || board.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`).textContent !== player) {
                break;
            }
    
            count++;
        }
    
        // Adjust the condition to consider edge-to-edge diagonals
        return count >= Math.min(sizeY, sizeX) - 1 && count <= Math.max(sizeY, sizeX) - 1;
    }
    
    
    function checkPoints(row, col) {
        const horizontalScore = checkEdgeToEdge(row, col, 1, 0, 'horizontal');
        const verticalScore = checkEdgeToEdge(row, col, 0, 1, 'vertical');
        const diagonalScore = checkEdgeToEdge(row, col, 1, 1, 'diagonal') || checkEdgeToEdge(row, col, 1, -1, 'diagonal');
    
        // Check if any score is achieved and the pattern is fully occupied
        if ((horizontalScore && isPatternOccupied(winningPatterns['horizontal'])) ||
            (verticalScore && isPatternOccupied(winningPatterns['vertical'])) ||
            (diagonalScore && isPatternOccupied(winningPatterns['diagonal']))) {
    
            scores[currentPlayer]++;
            updateScores();
            alert(`Player ${currentPlayer} scores 1 point!`);
            resetBoard();
            return true; // Return true if any score is achieved and the pattern is fully occupied
        }
    
        return false; // Return false if no score is achieved or the pattern is not fully occupied
    }
    
    function isPatternOccupied(pattern) {
        // Check if all cells in the pattern are occupied by the current player
        return pattern.every(index => {
            const rowIndex = Math.floor(index / sizeX);
            const colIndex = index % sizeX;
            const cell = board.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
            return cell.textContent === currentPlayer;
        });
    }
    
    
    
    

    function checkWinner(row, col) {
        return (
            checkEdgeToEdge(row, col, 1, 0, 'horizontal') || // Horizontal
            checkEdgeToEdge(row, col, 0, 1, 'vertical') || // Vertical
            checkEdgeToEdge(row, col, 1, 1, 'diagonal') || // Diagonal \
            checkEdgeToEdge(row, col, 1, -1, 'diagonal')   // Diagonal /
        );
    }

    const winningPatterns = {
        'horizontal': [
            [0, 1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10, 11],
            [12, 13, 14, 15 ,16, 17],
            [18, 19, 20, 21, 22, 23],
            [24, 25, 26, 27, 28, 29],
        ],
        'vertical': [
            [0, 6, 12, 18, 24],
            [1, 7, 13, 19, 25],
            [2, 8, 14, 20, 26],
            [3, 9, 15, 21, 27],
            [4, 10, 16, 22, 28],
            [5, 11, 17, 23, 29],
        ],
        'diagonal': [
            [18, 25],
            [12, 19, 26],
            [6, 13, 20, 27],
            [0, 7, 14, 21, 28],
            [1, 8, 15, 22, 29],
            [2, 9, 16, 23],
            [3, 10, 17],
            [4, 11],
            [23, 28],
            [17, 22, 27],
            [11, 16, 21, 26],
            [5, 10, 15, 20, 25],
            [4, 9, 14, 19, 24],
            [3, 8, 13, 18],
            [2, 7, 12],
            [1, 6],
        ]
    };

    function checkWinner(row, col) {
        for (const pattern of winningPatterns['horizontal']) {
            if (checkPattern(row, col, pattern)) {
                return true;
            }
        }
    
        for (const pattern of winningPatterns['vertical']) {
            if (checkPattern(row, col, pattern)) {
                return true;
            }
        }
    
        for (const pattern of winningPatterns['diagonal']) {
            if (checkPattern(row, col, pattern)) {
                return true;
            }
        }
    
        return false;
    }
    
    function checkPattern(row, col, pattern) {
        const player = currentPlayer;
        for (const index of pattern) {
            const rowIndex = Math.floor(index / sizeX);
            const colIndex = index % sizeX;
    
            // Check if the cell is out of bounds or belongs to a different player
            if (rowIndex < 0 || rowIndex >= sizeY || colIndex < 0 || colIndex >= sizeX || board.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`).textContent !== player) {
                return false;
            }
        }
    
        return true;
    }
    





    function checkDraw() {
        const cells = document.querySelectorAll('.cell');
        for (const cell of cells) {
            if (!cell.textContent) {
                return false; // If there is any empty cell, the game is not a draw
            }
        }
        return true; // All cells are filled, and no winner
    }

    function makeAIMove() {
        const emptyCells = document.querySelectorAll('.cell:not(.X):not(.O)');
        if (emptyCells.length > 0) {
            // Choose a random empty cell
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const randomCell = emptyCells[randomIndex];
            const row = randomCell.dataset.row;
            const col = randomCell.dataset.col;

            // Simulate a click on the randomly chosen cell
            handleCellClick({ target: randomCell });

            // Update the current player to switch back to the human player
            currentPlayer = 'X';
        }
    }

    // Event listener for changing settings or difficulties
    categoryDropdown.addEventListener('change', function () {
        resetGame();
    });

    playersDropdown.addEventListener('change', function () {
        resetGame();
    });

    // Event listener for the reset button
    resetButton.addEventListener('click', function () {
        resetGame();
    });
});