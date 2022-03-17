// Tucked everything inside of a module and factory

// Controls the game baord
const Gameboard = (() => {
    let userBoard = new Array(9);

    // Adds sign in desired index
    const setBoard = (index, sign) => {
        userBoard[index] = sign;
    }
    
    // Return desired sign  
    const getBoard = (index) => userBoard[index];

    // Reset array
    const resetBoard = () => {
        userBoard = new Array(9);
    }

    // Updates the baord
    const updateBoard = () => {
        const boardN = document.querySelectorAll('.tic-played');
        userBoard.forEach((sign, index) => {
            boardN[index].innerText = sign;
        });
    }

    const userArr = () => userBoard;

    return {setBoard, getBoard, resetBoard, updateBoard, userArr}
})();


// Controls the player
const Player = (sign) => {
    this.sign = sign;
    
    const getSign = () => sign;
    
    return {getSign}
}

// Controls the ai/cpu
const AiLogic = (() => {    

    // Places its sign on the best available board
    const computerPlay = () => {
        let clone = [...Gameboard.userArr()];
        return getBestMove(clone);
    }

    // Checks three in a row
    const threeInARow = (a, b, c) => {
        return a == b && b == c && a != undefined;
    }
      
    // Checks the board winner
    const evaluate = (board) => {
        let winner = null;
        
        // Horizontal
        if(threeInARow(board[0], board[1], board[2])) winner = board[0];
        if(threeInARow(board[3], board[4], board[5])) winner = board[3];
        if(threeInARow(board[6], board[7], board[8])) winner = board[6];
        
        // Vertical
        if(threeInARow(board[0], board[3], board[6])) winner = board[0];
        if(threeInARow(board[1], board[4], board[7])) winner = board[1];
        if(threeInARow(board[2], board[5], board[8])) winner = board[2];
        
        // Diagonal
        if(threeInARow(board[0], board[4], board[8])) winner = board[0];
        if(threeInARow(board[2], board[4], board[6])) winner = board[2];
        
        let openSpots = 0;
        for(let i = 0; i < board.length; i++){
            if(board[i] == undefined) openSpots++;
        }
        
        if(winner == null && openSpots == 0) return 'Draw';
        else return winner;
    }

    let scores = {
        X: -10,
        O: +10,
        Draw: 0
    };

    // Returns the best possible move for the ai
    const getBestMove = (currentBoard) => {
        let bestValue = -Infinity;
        let bestMove = -1;

        for(let i = 0; i < currentBoard.length; i++){
            if(currentBoard[i] == undefined){
                currentBoard[i] = 'O';
                let value = minimax(currentBoard, 0, false);
                currentBoard[i] = undefined;
                if(value > bestValue){
                    bestMove = i;
                    bestValue = value;
                }
            }
        }
        return bestMove
    }

    // Returns the best value for that move 
    const minimax = (currentBoard, depth, isMax) => {

        let result = evaluate(currentBoard);
        if(result !== null) {
            return scores[result];
        }

        if(isMax){
            let bestValue = -Infinity;
            for(let i = 0; i < currentBoard.length; i++){
                if (currentBoard[i] == undefined){
                    currentBoard[i] = 'O';
                    bestValue = Math.max(bestValue, minimax(currentBoard, depth + 1, !isMax));
                    currentBoard[i] = undefined;
                }
            }
            return bestValue
        } 

        else{
            let bestValue = +Infinity;
            for (let i = 0; i < currentBoard.length; i++){
                if (currentBoard[i] == undefined){
                    currentBoard[i] = 'X';
                    bestValue = Math.min(bestValue, minimax(currentBoard, depth + 1, !isMax));
                    currentBoard[i] = undefined;
                }
            }
            return bestValue
        }
    }
    
    return {computerPlay}
})();

// controls the controls
const DisplayController = (() => {
    
    // Get all necessary DOM nodes 
    const aside = document.querySelector('aside');
    const player1Img = document.querySelector('.tic-plays .p1 img'); 
    const player2Img = document.querySelector('.tic-plays .p2 img');                               
    const p1Score = document.querySelector('.p1-score');
    const p2Score = document.querySelector('.p2-score');
    const ticPlayed = document.querySelectorAll('.tic-played');
    const chooseImg = document.querySelectorAll('aside img');

    // display/not-active aside
    const openAside = () => {
        aside.classList.add('overlay');
        aside.classList.remove('not-active');
    }

    const closeAside = () => {
        aside.classList.remove('overlay');
        aside.classList.add('not-active');
    } 
    openAside(),

    // Get the users opponent
    chooseImg.forEach((img) => {
        img.addEventListener('click', () => {
            if(img.id == 'player-img'){
                player2Img.src = 'images/player_icon.svg';
                player2Img.classList.add('player-icon');
                player2Img.classList.remove('ai-icon');
            } 
            if(img.id == 'ai-img') {
                player2Img.src = 'images/ai_icon.svg';
                player2Img.classList.remove('player-icon');
                player2Img.classList.add('ai-icon');
            }          
            p1Score.innerText = 0;
            p2Score.innerText = 0;  
            closeAside();
            switchColor();
        })
    })

    // AiPlay, with setTimeout function
    const aiPlay = () => {
        if(player2Img.classList.contains('ai-icon') && gameController.getPlayerSign() === 'O'){
            setTimeout(function(){
                gameController.startRound(AiLogic.computerPlay());
                Gameboard.updateBoard();
                switchColor();
            }, 2500);
        }
    }

    // Place sign in desired grid 
    ticPlayed.forEach((tic, index) => {
        tic.addEventListener('click', (e) => {
            if(e.target.innerText === '' && gameController.getPlayerSign() === 'X' && player2Img.classList.contains('ai-icon')){
                gameController.startRound(index);
                aiPlay();
            }
            if(e.target.innerText === '' && player2Img.classList.contains('player-icon')){
                gameController.startRound(index);
            }
            Gameboard.updateBoard();
            switchColor();
        })
    })
    
    // switch img color between rounds
    const switchColor = () => {
        if(gameController.getPlayerSign() === 'X'){
            player1Img.classList.add('img-active');
            player2Img.classList.remove('img-active');
        }
        else if(gameController.getPlayerSign() === 'O'){
            player1Img.classList.remove('img-active');
            player2Img.classList.add('img-active');
        }
    }

    // Restarts the game board
    document.querySelector('.restart-score').onclick = function(){
        Gameboard.resetBoard();
        ticPlayed.forEach((tic) => tic.innerText = '');
        gameController.resetRound();
        gameController.resetWins();
        p1Score.innerText = '0';
        p2Score.innerText = '0';
        switchColor();
    }

    // Restarts the game by reloading the page
    document.querySelector('.restart-game').onclick = function(){
        window.location.reload();
    }

    // pop up, with game result match
    const gameResult = (message) => {
        openAside();
        setTimeout(function(){
            Gameboard.resetBoard();
            ticPlayed.forEach((tic) => tic.innerText = '');
            gameController.resetRound();
            switchColor();
            Gameboard.updateBoard();
            closeAside();
        }, 1500);
        if(message === 'Draw') return popUpMessage('It\'s a Draw');
        else if(message.includes('the Game')){
            p1Score.innerText = '0';
            p2Score.innerText = '0';
            gameController.resetWins();
            if(gameController.getPlayerSign() === 'O' && player2Img.classList.contains('ai-icon')){
                aiPlay();
            }
            return popUpMessage(`Player ${message}`);
        } 
        else return popUpMessage(`Player ${message} Has Won`);
    }

    // Popup message
    const popUpMessage = (message) => {
        document.querySelector('aside .player').style.display = 'none';
        document.querySelector('aside .cpu').style.display = 'none';
        document.querySelector('aside > h2').innerText = `${message}`;
    }

    return {gameResult}
})();

// Controls the game
const gameController = (() => {
    let playerX = Player('X');
    let playerO = Player('O');
    let round = 1;
    let turn = 1;
    let xWins = 0;
    let oWins = 0; 

    // Start game round
    const startRound = (index) => {
        Gameboard.setBoard(index, getPlayerSign());
        if (checkWinner(index)) {
            if(getPlayerSign() === 'X'){
                xWins++;
                document.querySelector('.p1-score').innerText = xWins;
            } 
            if(getPlayerSign() === 'O'){
                oWins++;
                document.querySelector('.p2-score').innerText = oWins;
            } 
            if(xWins === 3 || oWins === 3){
                return DisplayController.gameResult(`${getPlayerSign()} Has Won the Game`);
            }
            DisplayController.gameResult(getPlayerSign());
        }
        else if (round === 9) {
            DisplayController.gameResult("Draw");
        }
        round++;
        turn++;
    };

    // Get the players sign
    const getPlayerSign = () => {
        if(document.querySelector('.tic-plays .p2 img').classList.contains('p2-img')){
            return turn % 2 === 1 ? playerX.getSign() : playerO.getSign();                   
        }
        else return turn % 2 === 1 ? playerX.getSign() : playerO.getSign();        
    }

    // Check winner, with every possible win
    const checkWinner = (fieldIndex) => {
        const winConditions = [
            [0, 1, 2], 
            [3, 4, 5], 
            [6, 7, 8],
            [0, 3, 6], 
            [1, 4, 7], 
            [2, 5, 8], 
            [0, 4, 8], 
            [2, 4, 6]
        ];

        return (
            winConditions.filter((combination) => combination.includes(fieldIndex))
                         .some((possibleCombination) => possibleCombination
                         .every((index) => Gameboard.getBoard(index) === getPlayerSign()))
        )
    }

    // Resets the round 
    const resetRound = () => round = 1;

    // Resets the wins
    const resetWins = () => {
        xWins = 0;
        oWins = 0;
    }

    return {startRound, getPlayerSign, resetRound, resetWins, checkWinner}
})();