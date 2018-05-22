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
