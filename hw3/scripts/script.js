/*
 * Javascript for Front-end Development HW 3: staring jQuery.
 * By Rafi Khan, October 9, 2013
 * https://github.com/rafi-khan/hackyale-homework
 */
$(document).ready(function() {
  /*
   * A function that creates a new blog post by creating a new node,
   * inserting the given information into it, and putting it into
   * the DOM. Here we're just creating a function—this code doesn't
   * run until the function is called. 
   */
  function createBlogPost(title, author, content) {
    // First, create the containing blog post. Note that this is NOT
    // yet on the page.
    var newPost = $('<div class="blog-post"></div>');
    // Create the title element. Note that we are chaining methods here!
    // The html I'm using is copied from what I wrote in index.html
    var titleElem = $('<h2 class="title"></h2>').text(title);
    var authorElem = $('<p class="author"></p>').text(author);
    var contentElem = $('<div class="content"></div>').text(content);
    // Add the title, author and content elements to the newPost div.
    $(newPost).append(titleElem, authorElem, contentElem);
    // Finally, add the new post to the actual DOM on the page. This time,
    // we're using the $ function as we saw in class: passing in a CSS selector
    // to find elements on the page. We look for all elements with class "posts"
    // (there's only one—check index.html), and append the newPost to it.
    $(".posts").append(newPost);
  }
  // The code below runs as soon as the page is loaded, and adds
  // a click handler to the element with id "submit". Code inside 
  // the function does not run until that element (which happens to be a 
  // big blue div) is clicked.
  $("#submit").click(function() {
    var title = $("#new-title").val();
    var author = $("#new-author").val();
    var content = $("#new-content").val();
    createBlogPost(title, author, content);
    // console.log(title, author, content);
    $(".input").val(""); // What does this line do? Leave it out of your code
                         // and see what happens. In particular, how is this
                         // use of val() different/same from a few lines above?
  })

});
