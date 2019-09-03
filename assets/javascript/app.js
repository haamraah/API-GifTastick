var topics = ["dog", "cat", "mouse", "lizard"];


// functions

function renderButtons() {

  // Deletes the topic buttons prior to adding new topic
  // (this is necessary otherwise you will have repeat buttons)
  $("#top").empty();

  // Loops through the array of topics
  for (var i = 0; i < topics.length; i++) {

    // Then dynamicaly generates buttons for each topic in the array
    // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
    var a = $("<button>");
    // Adds a class of topic to our button
    a.addClass("topic btn btn-outline-info m-1");
    // Added a data-attribute
    a.attr("data-name", topics[i]);
    //  added a startAt index
    a.attr("startAt", "0");

    // Provided the initial button text
    a.text(topics[i]);
    // Added the button to the top div
    $("#top").append(a);
  }
}
function displayGifs() {
  // empty buttom div before showing new data
  // $("#buttom").empty();
  // grab the topic from data-name attr of the button clicked
  var topic = $(this).attr("data-name");
  var startAt = $(this).attr("startAt");
  $(this).attr("startAt", (Number($(this).attr("startAt")) + 10));
  $(this).text(($(this).attr("data-name"))+"+("+(Number(startAt)+10)+")");
  console.log(startAt);
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=0zRvwT6PJIjlYCYxmO5t1APuUPVX83WB&limit=10&offset="+startAt;
  // Creates AJAX call for the specific topic button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    for (var i = 0; i < response.data.length; i++) {
      // creat a bootstrap CARD for each entry of the response array
      // 
      // id is dynamiclly generated for each CARD
      var cardDiv = $("<div>").addClass("card m-1 float-left").attr("style", "width: 18rem").attr("id", "div-" + response.data[i].id);
      // id is dynamiclly generated for each image , save the still and playing url from api in to src-still and src-play attribute, assign GIF class for event handler
      var newImg = $("<img>").attr("id", response.data[i].id).addClass("card-img-top GIF").attr("style", "max-height: 200px ;height :200px").attr("src-still", response.data[i].images.fixed_height_still.url).attr("src-play", response.data[i].images.fixed_height.url).attr("src", response.data[i].images.fixed_height_still.url);
      var cardBody = $("<div>").addClass("card-body").attr("style", "height :120px");
      // grab gif Title and Rating from API
      var newH = $("<h5>").addClass("card-title").text(topic+" : " + response.data[i].title);
      var newP = $("<p>").addClass("card-text").text("Rating : " + response.data[i].rating);
      cardBody.append(newH, newP);
      cardDiv.append(newImg, cardBody);

      // show card
      $("#buttom").append(cardDiv);

    }

  });
}
function playGif() {
  // create new img exactly like the one user clicked on it 
  var newImg = $(this);
  // set image src to src-play attr , we saved playing and still image url before , also add stopGIF class for event handler
  newImg.attr("src", $(this).attr("src-play")).attr("class", "card-img-top stopGIF border border-primary border-bottom");
  // remove still image and prepend moving GIF
  $("#" + $(this).attr("id")).remove();
  $("#div-" + $(this).attr("id")).prepend(newImg);
}
function stopGif() {
  // create new img exactly like the one user clicked on it 
  var newImg = $(this);
  // set image src to src-still attr , we saved playing and still image url before,also add GIF class for event handler
  newImg.attr("src", $(this).attr("src-still")).attr("class", "card-img-top GIF");
  // remove moving GIF and prepend still image
  $("#" + $(this).attr("id")).remove();
  $("#div-" + $(this).attr("id")).prepend(newImg);
}
$(document).on("click", ".topic", displayGifs);
$(document).on("click", ".GIF", playGif);
$(document).on("click", ".stopGIF", stopGif);

$(document).on("click", "#add-cat", function (event) {
  event.preventDefault();
  // make sure input is not empty
  if ($("#input").val().trim()) {
    // This line of code will grab the topic from the textbox
    var newTopic = $("#input").val().trim();
    // make sure we do not duplicate a topic
    if (!topics.includes(newTopic)) {
      // The topic from the textbox is then added to our array
      topics.push(newTopic);
      $("#input").val("")
      // Calling renderButtons which handles the processing of our topic array
      renderButtons();
    }
  }
});

// rendering initial 
$(document).ready(function () {
  renderButtons();

});
