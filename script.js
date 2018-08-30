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
    if ($('#persist-match-checkbox').is(':checked') && $('.player-dropdown')[0].value && $('.player-dropdown')[1].value) {
        db.collection('games').add({
            player1: db.doc('users/' + $('.player-dropdown').eq(0).val()),
            player1Score: parseInt($('.score').eq(0).text()),
            player2: db.doc('users/' + $('.player-dropdown').eq(1).val()),
            player2Score: parseInt($('.score').eq(1).text()),
            time: new Date()
        })
    }
}

function populatePlayerDropdowns() {
    var $dropdowns = $('.player-dropdown');
    $dropdowns.append('<option></option>');
    db.collection('users').orderBy('displayName').get().then((snapshot) => {
        snapshot.forEach((user) => {
            $dropdowns.append('<option value="' + `${user.id}` + '">' + user.data().displayName + '</option>');
        });
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
        $('#player-selection-panel').toggle(this.checked);
        $('#settings').css('margin-top', this.checked ? '5em' : '7em');
    });
});
