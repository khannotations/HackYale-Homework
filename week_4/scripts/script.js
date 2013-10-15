$(document).ready(function() {
  function updateDotPosition(x, y) {
    $("#dot").css({top: y, left: x});
  }
  var x = 10;
  var y = 10;
  var speed = 2;
  updateDotPosition(x, y);
  $(window).keydown(function(e) {
    switch(e.which) {
      case 37:
        x-=speed;
        break;
      case 38:
        y-=speed;
        break;
      case 39:
        x+=speed;
        break;
      case 40:
        y+=speed;
        break;
    }
    // Alternatively:
    // if (e.which === 37) {
    //   x-=speed;
    // } else if (e.which === 38) {
    //   y-=speed;
    // } else if (e.which === 39) {
    //   x+=speed;
    // } else if (e.which === 40) {
    //   y+=speed;
    // }
    updateDotPosition(x,y);
  });

  $("#change-speed").click(function() {
    speed = parseInt(prompt("What's the new speed? (1-10)"));
  });
});
