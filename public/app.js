console.log("in app.js")

$("#comment-here").hide()


$(document).on("click", ".btn-scrape", function() {
  console.log("clicked on more news");
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(response){
      console.log("ajax result: " + response);
      location.reload();
  })
  console.log("clicked on more news");
});


$(document).on("click", ".btn-del", function(event){
  event.preventDefault();
  var thisId = $(this).data('id')
  console.log( thisId);
  $.ajax({
    method: "DELETE",
    url: "/article/" + thisId
  }).done(function(response){
    console.log("response: " + response);
    location.reload();    
  });
});


$(document).on("click", "#btn-note", function() {
 event.preventDefault();
   thisId = $(this).data("id");
   console.log('thisID = '+ thisId)
  $.ajax({
    method: "GET",
    url: "/note/" + thisId
  });
  console.log("#btn-note");
   $("#parentId").val(thisId);
  $("#comment-here").show()
});




// When you click the savenote button
$(document).on("click", "#savenote", function() {
  console.log("parent id " + $("#parentId").val());
  console.log("title " + $("#commentTitle").val());
  console.log("body "  + $("#commentBody").val());

  var paramStr = $("#parentId").val() +"/"+ $("#commentTitle").val() + "/" +$("#commentBody").val()

  $.ajax({
    method: "POST",
    url: "/note/" + paramStr
  })





  // Grab the id associated with the article from the submit button
  // var thisId = $(this).attr("data-id");
  // console.log("this id = " + thisID)

  // Run a POST request to change the note, using what's entered in the inputs
  // $.ajax({
  //   method: "POST",
  //   url: "/articles/" + thisId,
  //   data: {
  //     // Value taken from title input
  //     title: $("#titleinput").val(),
  //     // Value taken from note textarea
  //     body: $("#bodyinput").val()
  //   }
  // })
    // With that done
    // .done(function(data) {
    //   // Log the response
    //   console.log(data);
    //   // Empty the notes section
    //   $("#notes").empty();
    // });

  // Also, remove the values entered in the input and textarea for note entry

});




    // With that done, add the note information to the page
    // .done(function(data) {
    //   // console.log(data);
    //   // The title of the article
    //   $("#notes").append("<h2>" + data.title + "</h2>");
    //   // An input to enter a new title
    //   $("#notes").append("<input id='titleinput' name='title' >");
    //   // A textarea to add a new note body
    //   $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    //   // A button to submit a new note, with the id of the article saved to it
    //   $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

    //   // If there's a note in the article
    //   if (data.note) {
    //     // Place the title of the note in the title input
    //     $("#titleinput").val(data.note.title);
    //     // Place the body of the note in the body textarea
    //     $("#bodyinput").val(data.note.body);
    //   }
    // });