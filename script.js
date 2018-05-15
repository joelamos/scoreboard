function incrementScore(element) {
  var currentScore = parseInt(element.innerHTML);
  element.innerHTML = currentScore + 1;
}

function reset() {
  var scores = $('.score').each(function() {
    this.innerHTML = 0;
  });
}

$(function() {
  $('.score').click(function() {
    incrementScore(this);
  });
  $('#reset').click(function() {
    reset();
  });
});
