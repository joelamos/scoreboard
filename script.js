function incrementScore(element) {
    if ($('.score.text-success').length == 0) {
        var currentScore = parseInt(element.innerHTML);
        element.innerHTML = ++currentScore;
        if (currentScore >= 11) {
            $('#game-to-21 input').bootstrapToggle('disable');
        }
        var maxScore = $('#game-to-21 > .toggle.off').length == 1 ? 11 : 21;
        var totalScore = 0;
        $('.score').each(function () {
            totalScore += parseInt(this.innerHTML);
        });
        var otherScore = totalScore - currentScore;
        var deuceMode = totalScore >= maxScore * 2 - 1;
        if ((deuceMode && currentScore - otherScore > 1) || (!deuceMode && currentScore == maxScore)) {
            $(element).addClass('text-success');
            return;
        }
        if (deuceMode ||
            ((maxScore == 21 && totalScore % 5 == 0) ||
            (maxScore == 11 && totalScore % 2 == 0))) {
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
}

$(function () {
    $('.score').click(function () {
        incrementScore(this);
    });
    $('#reset').click(function () {
        reset();
    });
    $('#switch-server').click(function () {
        switchServer();
    });
});
