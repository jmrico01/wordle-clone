const NUM_GUESSES = 6;
const NUM_TILES = 5;

let _answer = "54321";

let _activePlayer = null;
let _playerStates = [];

function isCharOk(char)
{
    return ["1", "2", "3", "4", "5"].includes(char);
}

function isEnterOk(state)
{
    return state.board[state.guessIndex].length === NUM_TILES;
}

function getPastGuessHints(guess, answer)
{
    console.assert(answer.length === NUM_TILES);
    console.assert(guess.length === answer.length);

    let hints = [];
    for (let t = 0; t < NUM_TILES; t++) {
        
    }
}

function redraw(state)
{
    let html = "";
    for (let g = 0; g < NUM_GUESSES; g++) {
        const str = state.board[g];
        const past = g < state.guessIndex;
        html += "<div class=\"row\">";
        for (let t = 0; t < NUM_TILES; t++) {
            const char = t < str.length ? str[t] : "";
            if (past) {
            } else {
                html += "<div class=\"tile\">" + char + "</div>";
            }
            let classExtra = "";
            if (past) {
                classExtra = " tilePast";
                if (char === answer[t]) {
                    classExtra += " tileCorrect";
                } else if (answer.includes(char)) {
                    classExtra += " tileSemiCorrect";
                }
            }
        }
        html += "</div>";
    }

    state.element.innerHTML = html;
}

function generateBoards(root, i)
{
    root.addEventListener("mouseenter", function() {
        _activePlayer = i;
    });
    root.addEventListener("mouseout", function() {
        // meh
    });

    let board = [];
    for (let g = 0; g < NUM_GUESSES; g++) {
        board.push("");
    }

    _playerStates[i] = {
        element: root,
        guessIndex: 0,
        board: board
    };

    redraw(_playerStates[i]);
}

window.onload = function() {
    const boards = document.getElementsByClassName("board");
    for (let i = 0; i < boards.length; i++) {
        generateBoards(boards[i], i);
    }

    document.addEventListener("keydown", function(e) {
        if (_activePlayer === null) {
            console.error("NO ACTIVE PLAYER");
            return;
        }

        const state = _playerStates[_activePlayer];
        let needRedraw = false;
        if (e.keyCode === 8) {
            state.board[state.guessIndex] = state.board[state.guessIndex].substring(0, state.board[state.guessIndex].length - 1);
            needRedraw = true;
        } else if (e.keyCode === 13) {
            if (isEnterOk(state)) {
                state.guessIndex += 1;
                needRedraw = true;
            }
        } else {
            if (isCharOk(e.key) && state.board[state.guessIndex].length < NUM_TILES) {
                state.board[state.guessIndex] += e.key;
                needRedraw = true;
            }
        }

        if (needRedraw) {
            redraw(state);
        }
    });
};