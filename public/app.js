console.log("in app.js")

$(".modal").hide();


$(document).on("click", ".btn-scrape", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(response){
    $("#scrapemodal").show();
  })
});


$(document).on("click", "#btn-close", function() {
  $(".modal").hide();
  window.location.reload();
})


$(document).on("click", ".btn-del", function(event){
  event.preventDefault();
  var thisId = $(this).data('id')
  console.log( thisId);
  $.ajax({
    method: "DELETE",
    url: "/article/" + thisId
  }).done(function(response){
    console.log("response: " + response);
    window.location.reload();    
  });
});


$(document).on("click", "#btn-note", function() {
 event.preventDefault();
   thisId = $(this).data("id");
   var parentsearchId = "N*" + thisId.toString()
   console.log('thisID = '+ parentsearchId)
  $.ajax({
    method: "GET",
    url: "/note/" + parentsearchId
  }).done(function(data){

          $(".comment").text(""); // empty table from previous request
          for (i=0; i<data.length; i++) {
            title = data[i].title;
            body = data[i].body;

            $(".comment").append(title + "<br>" + body +"<br><br>");

          }          
          
          $("#commentModal").show();

  });
});


// When you click the savenote button
$(document).on("click", "#savenote", function() {

  var parentsearchId = "N*" + thisId.toString();
  
  var paramStr = parentsearchId + "/" + $("#commentTitle").val() + "/" +$("#commentBody").val()

  $.ajax({
    method: "POST",
    url: "/note/" + paramStr
  }).done(function(response) {
    console.log("response: " + response)
  
    $("#commentTitle").val("");
    $("#commentBody").val("");
    $("#commentModal").hide();

  });


});
