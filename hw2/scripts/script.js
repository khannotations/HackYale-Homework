/*
 * Rafi Khan | 10.2.2013
 * HackYale Front-end Development
 */

// window.onload is a function that's called by the browser when
// the window loads. We wrap all our javascript in it—the reasons
// for that will be explained next class.
window.onload = function() {
  console.log("I'm ready!"); // Open the developer console to see this statement.
  // To open the developer's console: view -> developer -> console
  /*
   * Important concepts
   * 
   * document: Your entry point into the DOM (all of your HTML)
   * document.getElementsByTagName: (select elements by tag name)
   * document.getElementsByClassName: (select elements by class)
   * document.getElementById: (select *a single* element by ID)
   * Note that the first two functions return arrays and the last just
   * returns an element.
   */
   // Examples (check index.html first)
   var paras = document.getElementsByTagName("p");   // An array of length 6
   var pic = document.getElementsByClassName("pic"); // An array of length 1
   var par3 = document.getElementById("par3");       // A single p element
   console.log("paras", paras);
   console.log("pic", pic);
   console.log("par3", par3);

   var colors = ["blue", "pink", "green", "yellow"];
   for (var i=0; i<paras.length; i++) {
    // What does the code below do?
    // Hint: refresh index.html several times.
    var index = Math.floor(Math.random()*colors.length);
    paras[i].style.color = colors[index];
    console.log(paras[i].style);
   }
};
