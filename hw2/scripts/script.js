window.onload = function() {
  var p = document.getElementById("my-p");
  console.log(p);
  p.style.color = "red";
  p.style.backgroundColor = "blue";

  var lis = document.getElementsByTagName("li");

  for(var index=0; index<lis.length; index++) {
    var li = lis[index];
    var color = Math.floor((256.0/lis.length) * index);
    li.style.backgroundColor = "rgb("+color+","+color+","+color+")";
  }

  var response = prompt("Red, green or blue?");
  console.log(response);
}
