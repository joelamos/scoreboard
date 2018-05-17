function updateScore($score, increment) {
    if ($('.score.text-success').length == 0) {
        var currentScore = Math.max(0, parseInt($score.text()) + (increment ? 1 : -1));
        $score.text(currentScore);
        $('#game-to-21 input').bootstrapToggle(currentScore < 11 ? 'enable' : 'disable');
        var maxScore = $('#game-to-21 > .toggle.off').length == 1 ? 11 : 21;
        var totalScore = 0;
        $('.score').each(function () {
            totalScore += parseInt(this.innerHTML);
        });
        var otherScore = totalScore - currentScore;
        var deuceMode = totalScore >= maxScore * 2 - 1;
        if ((deuceMode && currentScore - otherScore > 1) || (!deuceMode && currentScore == maxScore)) {
            $score.addClass('text-success');
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
}

$(function () {
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
});
