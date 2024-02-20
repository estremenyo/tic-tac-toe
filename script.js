const Model = (function() {
    const players = (function() {
        const players = [];
        for (let i = 1; i <= 2; i++) {
            const player = {score: 0, isTurn: false, hasWon: false};
            players[i] = player;
        }
        return players;
    })();
    // 3x3 board of [rows][cols]
    const board = (function() {
        const board = [];
        for (let row = 0; row < 3; row++) {
            board[row] = [];
            for (let col = 0; col < 3; col++) {
                board[row][col] = [];
                board[row][col] = undefined;
            }
        }
        return board;
    })();
    const getBoard = () => { return board };
    const getPlayer = (player) => { return players[player] };
     return {getBoard, getPlayer};
})();


const View = (function() {
    console.log("Hello! Execute Controller.playGame() to start playing!");
    const displayBoard = (function() {
        console.log(" ");
        // Print Model rows (outer loop) and columns (inner loop)
        for (let i = 0; i < 3; i++) {
            let rowToPrint = "";
            for (let j = 0; j < 3; j++) {
                rowToPrint += `${Model.getBoard()[i][j]} `;
            }
            console.log(rowToPrint);
        }
    });
    return {displayBoard};
})();


const Controller = (function() {
    // const updateBoard;
    // const checkCell;
    const updateTurn = function() {
        Model.getPlayer(1).isTurn = Model.getPlayer(1).isTurn ? false : true;
        Model.getPlayer(2).isTurn = Model.getPlayer(2).isTurn ? false : true;
    }
    
    // assume we have already validated input earlier in the call stack
    const updateBoard = function(player, location) {
        location = location.split(", ");
        let value;
        if (player === 1) value = "x";
        else if (player === 2) value = "y";
        let [row, col] = location;
        Model.getBoard()[row][col] = value;
    }

    const getInput = function(currentPlayer) {
        let answer = "";
        while (!validateInput(answer)) {
            answer = prompt(`Player ${currentPlayer}, enter your answer here like so: 1, 2`);
        }
        return answer;
    }

    // return true if the answer is valid
    const validateInput = function(answer) {
        let parsed = answer.split(", ");
        if (parsed === undefined || parsed.length !== 2) {
            return false;
        }
        if (!(["0", "1", "2"].includes(parsed[0])) || !(["0", "1", "2"].includes(parsed[1]))) {
            console.log("Out of bounds");
            return false;
        }
        let board = Model.getBoard();
        if (board[parsed[0]][parsed[1]] !== undefined) {
            console.log("Cell already occupied");
            return false;
        }
        return true;
    }

    // checks for horizontal, vertical, and diagonal victory or a tie
    const checkWinner = function() {
        let board = Model.getBoard();
        let player1Symbol = "x";
        let player2Symbol = "y";
        let player1Matched = 0;
        let player2Matched = 0;
        let toMatch = 3;
        // horizontal
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                    if (board[i][j] === player1Symbol) player1Matched++;
                    if (board[i][j] === player2Symbol) player2Matched++;
                }
            if (player1Matched === toMatch || player2Matched === toMatch) {
                if (player1Matched === toMatch) Model.getPlayer(1).hasWon = true;
                else Model.getPlayer(2).hasWon = false;
                return true;
            }
            player1Matched = 0;
            player2Matched = 0;
            }
        // vertical 
        for (let i = 0; i < 3; i++) {
            // get the current match symbol by looking at every col of row 0
            for (let j = 0; j < 3; j++) {
                if (board[j][i] === player1Symbol) player1Matched++;
                if (board[j][i] === player2Symbol) player2Matched++;
            }
            if (player1Matched === toMatch || player2Matched === toMatch) {
                if (player1Matched === toMatch) Model.getPlayer(1).hasWon = true;
                else Model.getPlayer(2).hasWon = false;
                return true;
            }
            player1Matched = 0;
            player2Matched = 0;
        }
        // diaogonal top left to bottom right
        for (let i = 0; i < 3; i++) {
            if (board[i][i] === player1Symbol) player1Matched++;
            if (board[i][i] === player2Symbol) player2Matched++;
        }
        if (player1Matched === toMatch || player2Matched === toMatch) {
            if (player1Matched === toMatch) Model.getPlayer(1).hasWon = true;
            else Model.getPlayer(2).hasWon = false;
            return true;
        }
        player1Matched = 0;
        player2Matched = 0;
        // diagonal top right to bottom left
        for (let i = 0; i < 3; i++) {
            if(board[i][2 - i] === player1Symbol) player1Matched++;
            if(board[i][2 - i] === player2Symbol) player2Matched++;
        }
        if (player1Matched === toMatch || player2Matched === toMatch) {
            if (player1Matched === toMatch) Model.getPlayer(1).hasWon = true;
            else Model.getPlayer(2).hasWon = false;
            return true;
        }
        // if every cell in every row is not undefined
        const isTie = board.every(row => {
            return row.every(cell => cell !== undefined);
        })
        if (isTie) {
            View.isTie = true;
            return true;
        }
        // if none of the above checks have returned true, no one has won the game yet, so conitnue
        return false;
    }

    const playRound = function() {
        View.displayBoard();
        let currentPlayerTurn = Model.getPlayer(1).isTurn ? 1 : 2;
        let playerAnswer = getInput(currentPlayerTurn);
        updateBoard(currentPlayerTurn, playerAnswer);
        updateTurn();
    }

    const playGame = function() {
        // Set player 1 to go first
        Model.getPlayer(1).isTurn = true;
        // Keep playing rounds until winner found
        while (!checkWinner()) {
            playRound();
        }   
        // Display message when game over
        View.displayBoard();
        console.log(`Game Over!`);
        if (View.isTie) console.log("It's a tie!");
        else console.log(`${Model.getPlayer(1).hasWon ? "Player One Won" : "Player Two Won"}`);
    }

    return {playGame, checkWinner}; // remove checkWinner in production
})();