var maxScore = 21;

function incrementScore(element) {
    if ($('.score.text-success').length == 0) {
        var currentScore = parseInt(element.innerHTML);
        element.innerHTML = ++currentScore;
        if (currentScore >= 11) {
            $('#game-to-21 input').bootstrapToggle('disable');
        }
        if (currentScore == maxScore) {
            $(element).addClass('text-success');
        }
    }
}

function reset() {
    var scores = $('.score').removeClass('text-success').text('0');
    $('#game-to-21 input').bootstrapToggle('enable');
}

function onScoreToggle() {
    maxScore = $('#game-to-21 > .toggle.off').length == 1 ? 21 : 11;
}

$(function () {
    $('.score').click(function () {
        incrementScore(this);
    });
    $('#reset').click(function () {
        reset();
    });
    $('#game-to-21').click(function () {
        onScoreToggle();
    });
});
