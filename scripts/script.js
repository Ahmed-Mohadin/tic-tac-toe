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

    let possibleMoves = [];

    // places its sign on a random available board
    const computerPlay = () => {
        for(let i = 0; i < Gameboard.userArr().length; i++){
            if(Gameboard.getBoard(i) == undefined) possibleMoves.push(i);
        }
        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        return possibleMoves[randomIndex];
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