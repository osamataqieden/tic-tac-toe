function min(a,b) {
    if(a > b)
        return b;
    else return a;
}

const gameboard = (() => {
    /*
    0| 1 |2
    3| 4 |5
    6| 7 |8
    */
    var board = [null, null, null, null, null, null, null, null, null];
    const makeMove = (location, symbol) => {
        if(board[location] === null){
            board[location] = symbol;
            return true;
        }
        return false;
    }
    const isWinRow = (row) => {
        switch(row) {
            case 0:
                return (board[0] === board[1]) && (board[0] === board[2]); 
            case 1:
                return (board[3] === board[4]) && (board[3] === board[5]);
            case 2:
                return (board[6] === board[7]) && (board[6] === board[8]);
            default:
                return false;
        }
    }
    const isWinColumn = (column) => {
        switch(column) {
            case 0:
                return (board[0] === board[3]) && (board[0] === board[6]); 
            case 1:
                return (board[1] === board[4]) && (board[1] === board[7]);
            case 2:
                return (board[2] === board[5]) && (board[2] === board[8]);
            default:
                return false;
        }
    }
    const isWinDiagonal = (symbol) => {
        return ((symbol === board[0]) && (board[0] === board[4]) && (board[0] === board[8])) || ((board[2] === symbol) && (board[2] === board[4]) && (board[4] === board[6]));
    }
    const isWin = (symbol) => {
        let diag,verti,horz;
        if(board[0] === symbol || board[2] === symbol){
            diag = isWinDiagonal(symbol); //check for diagonal victory
        }
        for(let i = 0;i<3;i++){
            if(board[i] === symbol)
                verti = isWinColumn(i) || verti; //check for vertical victory.
        }
        for(let i = 0;i<3;i++){
            if(board[i * 3] === symbol){
                horz = isWinRow(i) || horz; //check for horizental victory
            }
        }
        return diag || verti || horz;
    }
    const reset = () => {
        board = [null, null, null, null, null, null, null, null, null];
    }
    const getBoard = () => {
        return board;
    }
    return {
        makeMove, 
        isWin, 
        reset, 
        getBoard
    };
})(); //define the gameboard using the module pattern.

const AIPlayer = (() => {
    let mutableBoard;
    const isWinRow = (row,board) => {
        switch(row) {
            case 0:
                return (board[0] === board[1]) && (board[0] === board[2]); 
            case 1:
                return (board[3] === board[4]) && (board[3] === board[5]);
            case 2:
                return (board[6] === board[7]) && (board[6] === board[8]);
            default:
                return false;
        }
    }
    const isWinColumn = (column,board) => {
        switch(column) {
            case 0:
                return (board[0] === board[3]) && (board[0] === board[6]); 
            case 1:
                return (board[1] === board[4]) && (board[1] === board[7]);
            case 2:
                return (board[2] === board[5]) && (board[2] === board[8]);
            default:
                return false;
        }
    }
    const isWinDiagonal = (symbol,board) => {
        return ((symbol === board[0]) && (board[0] === board[4]) && (board[0] === board[8])) || ((board[2] === symbol) && (board[2] === board[4]) && (board[4] === board[6]));
    }
    const isWin = (symbol,board) => {
        let diag,verti,horz;
        if(board[0] === symbol || board[2] === symbol){
            diag = isWinDiagonal(symbol,board); //check for diagonal victory
        }
        for(let i = 0;i<3;i++){
            if(board[i] === symbol)
                verti = isWinColumn(i,board) || verti; //check for vertical victory.
        }
        for(let i = 0;i<3;i++){
            if(board[i * 3] === symbol){
                horz = isWinRow(i,board) || horz; //check for horizental victory
            }
        }
        return diag || verti || horz;
    }
    const minmax = (turn,depth,board) => {
        console.log(depth);
        if(isWin('X',board))
            return -1;
        else if(isWin('O', board))
            return depth;
        let localdepth = 1000;
        for(let i = 0;i<9;i++){
            if(board[i] === null){
                newboard = board.slice();
                if(turn === 0){
                    newboard[i] = 'X';
                    localdepth = min(minmax(1,depth + 1, newboard), localdepth);
                    if(localdepth === -1)
                        return 1000000;
                    console.log(newboard);
                }
                else {
                    newboard[i] = 'O';
                    localdepth = min(minmax(0,depth + 1,newboard), localdepth);
                    if(localdepth === -1)
                        return 1000000;
                    console.log(newboard);
                }       
            }
        }
        return localdepth;
    }
    const calculateDepth = (index) => {
        mutableBoard[index] = 'O';
        return minmax(0,0,mutableBoard);
    }
    const nextMove = () => {
        mutableBoard = gameboard.getBoard().slice();
        let index, bestdepth;
        bestdepth = 100000;
        for(var i = 0;i<9;i++){
            if(mutableBoard[i] === null){
                let thisdepth = calculateDepth(i);
                mutableBoard = gameboard.getBoard().slice();
                if(bestdepth > thisdepth) {
                    bestdepth = thisdepth;
                    index = i;
                } 
            }
        }
        if(index === undefined)
            index = 3;
        console.log("Index: " + index);
        return index;
    }
    return {
        nextMove
    };
})();

const displayController = (() => {
    let turn = 0;
    let player1symbol = 'X';
    let player2symbol = 'O';
    let movesPlayed = 0;
    let done = false;
    const displayMove = (id) => {
        if(turn === 0){
            document.getElementById(id).innerHTML = player1symbol;
            document.getElementById(id).style.color = "black";
        }
        else{
            document.getElementById(id).innerHTML = player2symbol;
            document.getElementById(id).style.color = "rgb(185, 24, 24)";
        }
    }
    const displayVictory = () => {
        if(turn === 0)
            document.getElementById("gameendtext").innerHTML = "Player 1 wins!";
        else 
            document.getElementById("gameendtext").innerHTML = "Player 2 wins!"; 
        document.getElementById("gameBoard").style.backgroundColor = 'rgb(192, 190, 190)';
    }
    const resetBoard = () => {
        for(let i = 0;i<9;i++){
            document.getElementById(i).innerHTML = "";
        }
        document.getElementById("gameendtext").innerHTML = "";
        document.getElementById("gameBoard").style.backgroundColor = 'whitesmoke';
    }
    const displayTie = () => {
        document.getElementById("gameendtext").innerHTML = "Its A Tie!";
        document.getElementById("gameBoard").style.backgroundColor = 'rgb(192, 190, 190)';
    }
    const getTurn = () => {return turn;}
    const getMovesPlayed = () => {return movesPlayed;}
    const boxPressed = (id) => {
        if(done === true) {
            gameboard.reset();
            resetBoard();
            movesPlayed = 0;
            turn = 0;
            done = false;
        }
        else if(turn === 0){
            if(gameboard.makeMove(id,player1symbol)){ //move made.
                movesPlayed++;
                displayMove(id);
                if(gameboard.isWin(player1symbol)){
                    displayVictory();
                    done = true;
                }
                else if(movesPlayed === 9){
                    displayTie();
                    done = true;
                } 
                else {
                    turn = 1;
                }
                return true;
            }
            return false;
        }
        else {
            if(gameboard.makeMove(id,player2symbol)){ //move made.
                movesPlayed++;
                displayMove(id);
                if(gameboard.isWin(player2symbol)){
                    displayVictory();
                    done = true;
                }
                else if(movesPlayed === 9){
                    displayTie();
                    done = true;
                } 
                else {
                    turn = 0;
                }
                return true;
            }
            return false;
        }
        return false;
    }
    return {
        boxPressed,
        getTurn,
        getMovesPlayed
    }
})();


function boxPressed(id) {
    let val = displayController.boxPressed(id);
    console.log(val);
    if(!gameboard.isWin('X') && !gameboard.isWin('O') && !(displayController.getMovesPlayed() === 9) && val){
        if(displayController.getMovesPlayed() === 1){
            if(gameboard.getBoard()[2] === null)
                displayController.boxPressed(2);
            else displayController.boxPressed(0);
        }
        else displayController.boxPressed(AIPlayer.nextMove());
    }
}