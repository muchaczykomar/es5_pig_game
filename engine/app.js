/************************* GAME **************************/
var players;
var game_is_on = false;
var default_player_1_name = 'Gracz 1';
var default_player_2_name = 'Gracz 2';
var popup_0 = default_player_1_name;
var popup_1 = default_player_2_name;
var currentActivePlayer = 0;
var winningScore = 100;
var previousToss = null;
// MAP change querySelectors into more sophisticated names
var queryMap = {
    'PANEL_P0': document.querySelector('.player-0-panel'),
    'PANEL_P1': document.querySelector('.player-1-panel'),
    'SCORE_P0': document.querySelector('#score-0'),
    'SCORE_P1': document.querySelector('#score-1'),
    'CURRENT_P0': document.querySelector('#current-0'),
    'CURRENT_P1': document.querySelector('#current-1'),
    'NAME_P0': document.querySelector('#name-0'),
    'NAME_P1': document.querySelector('#name-1'),
    'BTN_ROLL': document.querySelector('.btn-roll'),
    'BTN_HOLD': document.querySelector('.btn-hold'),
    'SCORE_INPUT': document.querySelector('#win-score'),
    'BTN_NEW': document.querySelector('.btn-new'),
    'DICE': document.querySelector('.dice'),
    'RULES': document.querySelector('.rules')
};
var Player = function (score, currentScore) {
    return {
        score: score ? score : 0,
        currentScore: currentScore ? currentScore : 0
    }
};

document.onload = function () {

    queryMap.BTN_NEW.addEventListener("click", (function () {
        newGame(true)
    }));

}();

/*********************** FUNCTIONS ***********************/
function newGame(clicked = false, playAgain = false) {
    game_is_on = false;
    queryMap.SCORE_INPUT.removeAttribute("disabled");
    queryMap.SCORE_INPUT.classList.remove("disabled");

    playAgain ^ clicked ? players = initializePlayers(true) : players = initializePlayers();
    queryMap.PANEL_P0.classList.add('active');
    queryMap.PANEL_P1.classList.remove('active');

    queryMap.SCORE_P0.innerHTML = players[0].score;
    queryMap.SCORE_P1.innerHTML = players[1].score;

    queryMap.CURRENT_P0.innerHTML = players[0].currentScore;
    queryMap.CURRENT_P1.innerHTML = players[1].currentScore;

    queryMap.BTN_HOLD.addEventListener("click", hold);
    queryMap.BTN_ROLL.addEventListener("click", roll);
}

function initializePlayers(showDialogs) {
    currentActivePlayer = 0;
    if (showDialogs) {
        popup_0 = prompt('Please enter the name for Player 1');
        if (popup_0 === '' || !popup_0) {
            popup_0 = default_player_1_name;
        }
        queryMap.NAME_P0.innerHTML = popup_0;
        popup_1 = prompt('Please enter the name for Player 2');
        if (popup_1 === '' || !popup_1) {
            popup_1 = default_player_2_name;
        }
        queryMap.NAME_P1.innerHTML = popup_1;
    }
    return [new Player(0, 0), new Player(0, 0)];
}

function hold() {
    players[currentActivePlayer].score += players[currentActivePlayer].currentScore;
    document.querySelector('#score-' + currentActivePlayer).innerHTML = players[currentActivePlayer].score;
    players[currentActivePlayer].currentScore = 0;
    document.querySelector('#current-' + (currentActivePlayer ? 0 : 1)).innerHTML = players[currentActivePlayer].currentScore;
    currentActivePlayer = currentActivePlayer ? 0 : 1;
    document.querySelector('.player-' + currentActivePlayer + '-panel').classList.toggle('active');
    document.querySelector('.player-' + (currentActivePlayer ? 0 : 1) + '-panel').classList.toggle('active');
}

function roll() {
    if (!game_is_on) {
        var inputVal = queryMap.SCORE_INPUT.value;
        if (inputVal !== "" && !inputVal.startsWith("-") && !inputVal !== "0") {
            winningScore = inputVal;
        } else {
            queryMap.SCORE_INPUT.value = winningScore;
            alert("Wartość punktowa wymagana do wygrania rozgrywki musi zostać podana oraz musi być wartością niezerową!\nW przeciwnym razie zostanie wczytana domyślna wartość (100 punktów).");
        }
    }
    if (players[currentActivePlayer].score + players[currentActivePlayer].currentScore >= 100) {
        return;
    } else {
        game_is_on = true;
        queryMap.SCORE_INPUT.setAttribute("disabled", true);
        queryMap.SCORE_INPUT.classList.add("disabled");
    }

    var toss = Math.floor((Math.random() * 6) + 1);
    queryMap.DICE.setAttribute('src', 'dice-' + toss + '.png');
    if (previousToss === toss) {
        players[currentActivePlayer].score = 0;
        players[currentActivePlayer].currentScore = 0;
        document.querySelector('#score-' + currentActivePlayer).innerHTML = players[currentActivePlayer].score;
        hold();
    }
    toss === 1 ? (function () {
        players[currentActivePlayer].currentScore = 0;
        hold();
    })() : players[currentActivePlayer].currentScore += toss;
    document.querySelector('#current-' + currentActivePlayer).innerHTML = players[currentActivePlayer].currentScore;
    previousToss = toss;
    if (players[currentActivePlayer].score + players[currentActivePlayer].currentScore >= winningScore) {
        winner();
        setTimeout(playAgain, 0);
    }
}

function statistics() {
    var stringifyPlayers = JSON.stringify(players);
    stringifyPlayers = stringifyPlayers.replace("[{", "\n" + popup_0 + ": \n");
    stringifyPlayers = stringifyPlayers.replace("},{", "\n" + popup_1 + ": \n");
    stringifyPlayers = stringifyPlayers.replace("}]", "\n");
    alert("Statistics of the game: \n" + stringifyPlayers);
    return (function () {
        debugger;
    });
}

function winner() {
    game_is_on = false;
    queryMap.SCORE_INPUT.removeAttribute("disabled");
    queryMap.SCORE_INPUT.classList.remove("disabled");
    players[currentActivePlayer].score += players[currentActivePlayer].currentScore;
    document.querySelector('#score-' + currentActivePlayer).innerHTML = players[currentActivePlayer].score;
    players[currentActivePlayer].currentScore = 0;
    document.querySelector('#current-' + currentActivePlayer).innerHTML = players[currentActivePlayer].currentScore;
    game_is_on = false;
}

function playAgain() {
    var playAgain = confirm('Player ' + document.querySelector('#name-' + currentActivePlayer).innerHTML + ' win!\n Do You Want to Play again ?');
    playAgain ? newGame(false, false) : statistics();
}
