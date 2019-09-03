// var topics = ["dog", "cat", "mouse", "lizard"];
var topics = [
  {
    name: "dog",
    index: 0
  }
  , {
    name: "cat",
    index: 0
  }
  , {
    name: "party",
    index: 0
  }
  , {
    name: "good job",
    index: 0
  }


]

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
    a.attr("data-name", topics[i].name);
    //  added a startAt index
    a.attr("startAt", topics[i].index);

    // Provided the initial button text
    a.text(topics[i].name + " +" + topics[i].index);
    // Added the button to the top div
    $("#top").append(a);

    // a.attr("startAt", (Number($(this).attr("startAt")) + 10));

  }
}
function displayGifs() {
  // empty buttom div before showing new data
  // $("#buttom").empty();
  // grab the topic from data-name attr of the button 
  var topic = $(this).attr("data-name");
  // grab the index of last image we loaded
  var startAt = $(this).attr("startAt");
  // add to the index


  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=0zRvwT6PJIjlYCYxmO5t1APuUPVX83WB&limit=10&offset=" + startAt;
  // Creates AJAX call for the specific topic button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    topics.filter(function (t) {
      if (t.name == topic) {
        t.index += response.data.length;
      }

      // re render buttons with new number of images loaded
      renderButtons();
    })
    for (var i = 0; i < response.data.length; i++) {
      // creat a bootstrap CARD for each entry of the response array
      //   
      // id is dynamiclly generated for each CARD
      var cardDiv = $("<div>").addClass("card bg-dark  m-1 float-left").attr("id", "div-" + response.data[i].id).attr("style", "width:310px ; min-width: 310px");
      // id is dynamiclly generated for each image , save the still and playing url from api in to src-still and src-play attribute, assign GIF class for event handler
      var newImg = $("<img>").attr("id", response.data[i].id).addClass("card-img-top GIF").attr("style", "max-height: 200px ;opacity: 1;height :200px;width:310px ; min-width: 310px ").attr("src-still", response.data[i].images.fixed_height_still.url).attr("src-play", response.data[i].images.fixed_height.url).attr("src", response.data[i].images.fixed_height_still.url);
      var cardBody = $("<div>").addClass("card-body text-info").attr("style", "background: rgb(0,0,0);height :120px");
      // grab gif Title and Rating from API
      var newH = $("<h5>").addClass("card-title").text(topic + " : " + response.data[i].title);
      var newP = $("<p>").addClass("card-text").text("Rating : " + response.data[i].rating);
      cardBody.append(newH, newP);
      cardDiv.append(newImg, cardBody);

      // show card
      $("#buttom").append(cardDiv);

    }

  });
}
function playGif(img) {


  // set image src to src-play attr , we saved playing and still image url before , also add stopGIF class for event handler
  img.attr("src", img.attr("src-play")).attr("class", "card-img-top stopGIF ");
  // remove still image and prepend moving GIF
  $("#" + img.attr("id")).remove();
  $("#div-" + img.attr("id")).prepend(img);
}
function stopGif(img) {

  // set image src to src-play attr , we saved playing and still image url before , also add stopGIF class for event handler
  img.attr("src", img.attr("src-still")).attr("class", "card-img-top GIF");
  // remove still image and prepend moving GIF
  $("#" + img.attr("id")).remove();
  $("#div-" + img.attr("id")).prepend(img);
}


$(document).on("click", ".topic", displayGifs);
$(document).on("click", ".GIF", function () {
  var newImg = $(this);
  // set image src to loading gif
  newImg.attr("src", "assets\\images\\loading.gif").attr("class", "card-img-top ");
  // remove still image and prepend moving GIF
  $("#" + newImg.attr("id")).remove();
  $("#div-" + newImg.attr("id")).prepend(newImg);
  setTimeout(function () { playGif(newImg) }, 1000);
});
$(document).on("click", ".stopGIF", function () {
  var newImg = $(this);
  // set image src to loading gif
  newImg.attr("src", "assets\\images\\loading.gif").attr("class", "card-img-top ");
  // remove still image and prepend moving GIF
  $("#" + newImg.attr("id")).remove();
  $("#div-" + newImg.attr("id")).prepend(newImg);
  setTimeout(function () { stopGif(newImg) }, 1000);
});
$(document).on("click", "#clear", function () {
  $("#buttom").empty();
  topics.filter(function (i) {
    i.index = 0;
  });
  renderButtons();
});
$(document).on("click", "#add-cat", function () {

  // make sure input is not empty
  if ($("#input").val().trim()) {
    // This line of code will grab the topic from the textbox
    var newTopic = $("#input").val().trim().toLowerCase();
    // make sure we do not duplicate a topic
    var notInTopics = true;
    topics.filter(function (i) {
      if (i.name == newTopic) {

        notInTopics = false;
      }
    })

    if (notInTopics) {
      // The topic from the textbox is then added to our array
      var newObj = { name: newTopic, index: 0 }
      topics.push(newObj);
      $("#input").val("")
      // Calling renderButtons which handles the processing of our topic array
      renderButtons(true);
    }
  }
});

// rendering initial 
$(document).ready(function () {
  renderButtons(true);




});
