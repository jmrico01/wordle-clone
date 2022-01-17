const NUM_GUESSES = 6;
const NUM_TILES = 5;

let _answer = "54321";

let _activePlayer = null;
let _playerStates = [];

let HINT_NONE = 0;
let HINT_SEMI = 1;
let HINT_CORRECT = 2;

function isCharOk(char)
{
    return ["1", "2", "3", "4", "5"].includes(char);
}

function isEnterOk(state)
{
    return state.board[state.guessIndex].length === NUM_TILES;
}

function calculateHints(guess, answer)
{
    console.assert(answer.length === NUM_TILES);
    console.assert(guess.length === answer.length);

    let answerCopy = Array.from(answer);
    let hints = new Array(NUM_TILES);
    for (let t = 0; t < NUM_TILES; t++) {
        hints[t] = HINT_NONE;
        if (guess[t] === answerCopy[t]) {
            hints[t] = HINT_CORRECT;
            answerCopy[t] = null;
        }
    }

    for (let t = 0; t < NUM_TILES; t++) {
        if (hints[t] === HINT_CORRECT) {
            continue;
        }

        const ind = answerCopy.indexOf(guess[t]);
        console.log(answerCopy);
        console.log(ind);
        if (ind === -1) {
            hints[t] = HINT_NONE;
        } else {
            hints[t] = HINT_SEMI;
            answerCopy[ind] = null;
        }
    }

    return hints;
}

function redraw(state)
{
    let html = "";
    for (let g = 0; g < NUM_GUESSES; g++) {
        const str = state.board[g];
        const past = g < state.guessIndex;
        html += "<div class=\"row\">";
        if (past) {
            const hints = calculateHints(str, _answer);
            for (let t = 0; t < NUM_TILES; t++) {
                let classExtra = "tilePast";
                if (hints[t] === HINT_CORRECT) {
                    classExtra += " tileCorrect";
                } else if (hints[t] === HINT_SEMI) {
                    classExtra += " tileSemi";
                }
                html += "<div class=\"tile " + classExtra + "\">" + str[t] + "</div>";
            }
        } else {
            for (let t = 0; t < NUM_TILES; t++) {
                const char = t < str.length ? str[t] : "";
                html += "<div class=\"tile\">" + char + "</div>";
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