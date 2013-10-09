$(document).ready(function() {
  var p = $("#my-p");
  console.log(p);
  $(p).css({color: "red", backgroundColor: "blue"});
  $(p).html("Something funky with jQuery!");
  $(p).click(function() {
    alert("hi");
  });
  var lis = $("li");
  for(var index=0; index<lis.length; index++) {
    var li = lis[index];
    var color = Math.floor((256.0/lis.length) * index);
    $(li).css("backgroundColor",
      "rgb("+color+","+color+","+color+")");
  }

  // var response = prompt("jQuery, or plain Javascript?");
  // console.log(response);
});
