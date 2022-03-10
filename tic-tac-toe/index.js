    const cells = document.querySelectorAll('.cell');
    const display = document.querySelector('.display');
    let playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const historyButton = document.querySelector('#history');
    const history = document.querySelector('.history');
    const lastTenResults = document.querySelector('.last-ten-result');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    let turnsCounter = 0;

    let XWinCounter = 0;
    let OWinCounter = 0;
    let tieCounter = 0;
    let lastTenGames = [];

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    
    const toggleCellAnimation = (cell) => {
            cell.classList.toggle('active');
    }

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            writeHistory(currentPlayer);
            cells.forEach((cell) => {
                if (cell.classList.contains('active')) {
                    toggleCellAnimation(cell);
                }
            });
            return;
        }

        if (!board.includes('')) {
        announce(TIE);
        writeHistory('tie');
        }
    }

    const announce = (type) => {
        switch(type){
            case PLAYERO_WON:
                display.innerHTML = 'Player <span class="playerO">O</span> Won' + ` (${turnsCounter} turns)`;
                break;
            case PLAYERX_WON:
                display.innerHTML = 'Player <span class="playerX">X</span> Won' + ` (${turnsCounter} turns)`;
                break;
            case TIE:
                display.innerText = 'Tie';
        }
    };

    const writeHistory = (type) => {
        const historyResult = document.querySelector(`.${type}-history-result`);

        switch(type) {
            case 'X':
                XWinCounter++;
                historyResult.textContent = XWinCounter;
                lastTenGames.push(`<span class="playerX">X${turnsCounter}</span>`);
                break;
            case 'O':
                OWinCounter++;
                historyResult.textContent = OWinCounter;
                lastTenGames.push(`<span class="playerO">O${turnsCounter}</span>`);
                break;
            case 'tie':
                tieCounter++;
                historyResult.textContent = tieCounter;
                lastTenGames.push(`<span>T</span>`);
        }

        arrLengthCheck(lastTenGames, 10);
        lastTenResults.innerHTML = lastTenGames.join('');
    }

    const arrLengthCheck = (arr, len) => {
        if (arr.length > len) {
            arr.shift();
        }
    }

    const isValidAction = (cell) => {
        if (cell.innerText === 'X' || cell.innerText === 'O'){
            return false;
        }

        return true;
    };

    const updateBoard =  (index) => {
        board[index] = currentPlayer;
        turnsCounter++;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (cell, index) => {
        if(isValidAction(cell) && isGameActive) {
            toggleCellAnimation(cell);
            cell.innerText = currentPlayer;
            cell.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }
    
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        display.innerHTML = 'Player <span class="display-player playerX">X</span>\'s turn';
        playerDisplay = document.querySelector('.display-player');
        turnsCounter = 0;

        if (currentPlayer === 'O') {
            changePlayer();
        }

        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('playerX');
            cell.classList.remove('playerO');
            if (!cell.classList.contains('active')) {
                toggleCellAnimation(cell);
            }
        });
    }

    cells.forEach( (cell, index) => {
        cell.addEventListener('click', () => userAction(cell, index));
    });

    function setLocalStorage() {
        localStorage.setItem('XWinCounter', XWinCounter);
        localStorage.setItem('OWinCounter', OWinCounter);
        localStorage.setItem('tieCounter', tieCounter);
        localStorage.setItem('lastTenGames', lastTenGames);
    }

    function getLocalStorage() {
        if(localStorage.getItem('XWinCounter')) {
            XWinCounter = localStorage.getItem('XWinCounter');
            const historyResultX = document.querySelector(`.X-history-result`);
            historyResultX.textContent = XWinCounter;
        }

        if(localStorage.getItem('OWinCounter')) {
            OWinCounter = localStorage.getItem('OWinCounter');
            const historyResultO = document.querySelector('.O-history-result');
            historyResultO.textContent = OWinCounter;
        }

        if(localStorage.getItem('tieCounter')) {
            tieCounter = localStorage.getItem('tieCounter');
            const historyResultTie = document.querySelector('.tie-history-result');
            historyResultTie.textContent = tieCounter;
        }

        if(localStorage.getItem('lastTenGames')) {
            lastTenGames = localStorage.getItem('lastTenGames').split(',');
            const lastTenGamesResult = document.querySelector('.last-ten-result');
            lastTenGamesResult.innerHTML = lastTenGames.join('');
        }
    }
    
    window.addEventListener('load', getLocalStorage)
    
    window.addEventListener('beforeunload', setLocalStorage)

    resetButton.addEventListener('click', resetBoard);

    historyButton.addEventListener('click', () => {
        history.classList.toggle('active');
    });

    console.log('Все требования технического задания выполнены. \nНадеюсь, не смутит примитивность анимации. Она реализована так, чтобы активироваться только на доступных полях во время игры');