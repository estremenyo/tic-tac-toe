const Model = (function() {
    const players = (function() {
        const players = [];
        for (let i = 1; i <= 2; i++) {
            const player = {score: 0, isTurn: false, hasWon: false, name: undefined};
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
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let div = document.createElement("div");
            div.dataset.row = i;
            div.dataset.col = j;
            div.classList.toggle("disabled");
            document.querySelector("main").appendChild(div);
        }
    }
    function updateCell(cell, player) {
        cell.textContent = player === 1 ? "X" : "O";
    }
    return { updateCell };
})();


const Controller = (function() {
    const updateTurn = function() {
        Model.getPlayer(1).isTurn = Model.getPlayer(1).isTurn ? false : true;
        Model.getPlayer(2).isTurn = Model.getPlayer(2).isTurn ? false : true;
    }
    
    const initializeCells = function() {
        let divNodeList = document.querySelectorAll("div");
        let divArray = Array.from(divNodeList);
        divArray.forEach(div => addEventListener("click", handleClick));
    };

    const initializeRestartBtn = (function () {
        let btn = document.querySelector("button#reset");
        function reset() {
            if (Model.getPlayer(2).isTurn) updateTurn();
            let divNodeList = document.querySelectorAll("div");
            let divArray = Array.from(divNodeList);
            divArray.forEach(div => div.textContent = "");
            divArray.forEach(div => addEventListener("click", handleClick));
            divArray.forEach(div => div.classList.toggle("disabled"));
            const board = Model.getBoard();
            Model.getPlayer(1).name = undefined;
            Model.getPlayer(2).name = undefined;
            Model.getPlayer(1).hasWon = false;
            Model.getPlayer(2).hasWon = false;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    board[row][col] = undefined;
                }
            }
            document.querySelector("input#player1").disabled = false;
            document.querySelector("input#player2").disabled = false;
            document.querySelector("input#player1").value = "";
            document.querySelector("input#player2").value = "";
            document.querySelector("p").textContent = "Type in player names and press start to start";
        }
        btn.addEventListener("click", reset);
    })();

    const initializeStartBtn = (function () {
        let btn = document.querySelector("button#play");
        btn.addEventListener("click", () => {
            let p1NameInput = document.querySelector("input#player1");
            let p2NameInput = document.querySelector("input#player2");


            Model.getPlayer(1).name = p1NameInput.value;
            Model.getPlayer(2).name = p2NameInput.value;

            p1NameInput.disabled = true;
            p2NameInput.disabled = true;
            let divNodeList = document.querySelectorAll("div");
            let divArray = Array.from(divNodeList);
            divArray.forEach(div => div.classList.toggle("disabled"));
            initializeCells();
        })
    })();

    function removeEventListeners() {
        let divNodeList = document.querySelectorAll("div");
        let divArray = Array.from(divNodeList);
        divArray.forEach(div => removeEventListener("click", handleClick));
    }

    function handleClick(e) {
        if (e.target.textContent === "") {
            let currentPlayerTurn = Model.getPlayer(1).isTurn ? 1 : 2;
            View.updateCell(e.target, currentPlayerTurn);
            updateBoard(currentPlayerTurn, e.target);
            if (checkWinner()) {
                removeEventListeners();
                let result = document.querySelector("p");
                if (Model.isTie) result.textContent = ("It's a tie");
                else result.textContent = (`Player ${currentPlayerTurn === 1 ? Model.getPlayer(1).name : Model.getPlayer(2).name} has won`);
                return;
            }
            updateTurn();
        } else {
            return;
        }
    }

    // assume we have already validated input earlier in the call stack
    const updateBoard = function(player, location) {
        let value;
        if (player === 1) value = "X";
        else if (player === 2) value = "O";

        let row = location.dataset.row;
        let col = location.dataset.col;
        Model.getBoard()[row][col] = value;
    }

    // checks for horizontal, vertical, and diagonal victory or a tie
    const checkWinner = function() {
        let board = Model.getBoard();
        let player1Symbol = "X";
        let player2Symbol = "O";
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
            Model.isTie = true;
            return true;
        }
        // if none of the above checks have returned true, no one has won the game yet, so continue
        return false;
    }


    return {};
})();

Model.getPlayer(1).isTurn = true;