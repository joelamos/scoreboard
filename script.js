function updateScore($scoreElement, increment) {
    var score = parseInt($scoreElement.text());
    if ($('.score.text-success').length == 0 && (increment || score > 0)) {
        score += increment ? 1 : -1;
        $scoreElement.text(score);
        $('#game-to-21 input').bootstrapToggle(score < 11 ? 'enable' : 'disable');
        var maxScore = $('#game-to-21 > .toggle.off').length == 1 ? 11 : 21;
        var totalScore = 0;
        $('.score').each(function () {
            totalScore += parseInt(this.innerHTML);
        });
        var otherScore = totalScore - score;
        var deuceMode = totalScore >= maxScore * 2 - 1;
        if ((deuceMode && score - otherScore > 1) || (!deuceMode && score == maxScore)) {
            $scoreElement.addClass('text-success');
            recordGame();
            return;
        }
        var serves = maxScore == 21 ? 5 : 2;
        if (totalScore != 0 && (deuceMode || ((totalScore + (increment ? 0 : 1)) % serves == 0))) {
            switchServer();
        }
    }
}

function switchServer() {
    $('.serving').toggleClass('invisible');
}

function reset() {
    var scores = $('.score').removeClass('text-success').text('0');
    $('#game-to-21 input').bootstrapToggle('enable');
    $('.player-dropdown').val('');
}

function recordGame() {
    var persistMatch = $('#persist-match-checkbox').is(':checked');
    var team1Player1 = $('#team1 .player-dropdown:first').val();
    var team1Player2 = $('#team1 .player-dropdown:last').val();
    var team2Player1 = $('#team2 .player-dropdown:first').val();
    var team2Player2 = $('#team2 .player-dropdown:last').val();
    var doublesChecked = $('#doubles-checkbox').is(':checked');
    var singlesMatch = !doublesChecked && team1Player1 && team2Player1;
    var doublesMatch = doublesChecked && team1Player1 && team2Player1 && team1Player2 && team2Player2;

    if (persistMatch && (singlesMatch || doublesMatch)) {
        var game = {
            team1: [db.doc('users/' + team1Player1)],
            team1Score: parseInt($('.score').eq(0).text()),
            team2: [db.doc('users/' + team2Player1)],
            team2Score: parseInt($('.score').eq(1).text()),
            time: new Date()
        };

        if (doublesMatch) {
            game.team1.push(db.doc('users/' + team1Player2));
            game.team2.push(db.doc('users/' + team2Player2));
        }

        db.collection('games').add(game);
    }
}

function populatePlayerDropdowns() {
    var $dropdowns = $('.player-dropdown');
    $dropdowns.append('<option></option>');
    db.collection('users').orderBy('displayName').get()
    .then(function (snapshot) { // on promise resolved
        snapshot.forEach(function (user) {
            $dropdowns.append('<option value="' + user.id + '">' + user.data().displayName + '</option>');
        });
    }, function (error) { // on promise rejected
        alert('Error while fetching players.\n\n' + error.stack);
    });
}

$(function () {
    populatePlayerDropdowns();
    $('.score-container').click(function () {
        updateScore($(this).find('.score'), true);
    });
    $('.decrement').click(function () {
        var firstDecrementButton = this == $('.decrement:first-child')[0];
        var $score = $('.score').eq(firstDecrementButton ? 0 : 1);
        updateScore($score, false);
    });
    $('#reset').click(function () {
        reset();
    });
    $('#switch-server').click(function () {
        switchServer();
    });
    $('#persist-match-checkbox').change(function() {
        $('#player-selection-panel, #doubles').toggle(this.checked);
        $('#settings').css('margin-top', this.checked ? '5em' : '7em');
    });
    $('#doubles-checkbox').change(function () {
        $('.player-dropdown:last-child').toggle(this.checked);
    });
});
