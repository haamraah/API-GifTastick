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

// //////////
// functions
// //////////

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

  }
}
function displayGifs() {

  // grab the topic from data-name attr of the button 
  var topic = $(this).attr("data-name");
  // grab the index of last image we loaded
  var startAt = $(this).attr("startAt");
  // creat the url for AJAX 
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=0zRvwT6PJIjlYCYxmO5t1APuUPVX83WB&limit=4&offset=" + startAt;
  // Creates AJAX call for the specific topic button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    // add to the index - initial value is 0 and increments by the lenght of the respons array
    topics.filter(function (t) {
      if (t.name == topic) {
        t.index += response.data.length;
      }
      // re render buttons with new number of images loaded => respons.data.lenght if 0 means there was no respons from api
      renderButtons();
    })
    for (var i = 0; i < response.data.length; i++) {
      // creat a bootstrap CARD for each entry of the response.data array
      //   
      // id is dynamiclly generated for each CARD
      var cardDiv = $("<div>").addClass("card bg-dark  m-1 float-left").attr("id", "div-" + response.data[i].id).attr("style", "width:310px ; min-width: 310px");
      // id is dynamiclly generated for each image , save the still and playing url from api in to src-still and src-play attribute, assign GIF class for event handler
      var newImg = $("<img>").attr("id", response.data[i].id).addClass("card-img-top GIF").attr("style", "max-height: 200px ;height :200px;width:310px ; min-width: 310px ").attr("src-still", response.data[i].images.fixed_height_still.url).attr("src-play", response.data[i].images.fixed_height.url).attr("src", response.data[i].images.fixed_height_still.url).attr("rating", response.data[i].rating).attr("title", response.data[i].title);
      var cardBody = $("<div>").addClass("card-body text-info").attr("style", "background: rgb(0,0,0);height :160px");
      var newlink = $("<a>").addClass("save btn btn-outline-info").text("♡").attr("image-id", response.data[i].id);

      // grab gif Title and Rating from API
      var newH = $("<h5>").addClass("card-title").text(topic + " : " + response.data[i].title);
      var newP = $("<p>").addClass("card-text").text("Rating : " + response.data[i].rating);
      cardBody.append(newlink, newH, newP);
      cardDiv.append(newImg, cardBody);
      // show new card on top
      $("#buttom").prepend(cardDiv);
    }
  });
}
function playGif(img) {
  // set image src to src-play attr , we saved playing and still image url before , also add stopGIF class for event handler
  img.attr("src", img.attr("src-play")).attr("class", "card-img-top stopGIF ");

}
function stopGif(img) {
  // set image src to src-play attr , we saved playing and still image url before , also add stopGIF class for event handler
  img.attr("src", img.attr("src-still")).attr("class", "card-img-top GIF");

}


function showSaved() {
  // read localStorage and save it in obj, then we read each key in the obj object 
  var obj = localStorage;
  Object.keys(obj).forEach(function (key) {
    // for each key we have a json , use parse for convert json to js object 
    var element = JSON.parse(localStorage.getItem(key))
    // 
    var cardDiv = $("<div>").addClass("card bg-dark  m-1 float-left").attr("id", "div-" + element.id).attr("style", "width:310px ; min-width: 310px");
    // id is dynamiclly generated for each image , save the still and playing url from api in to src-still and src-play attribute, assign GIF class for event handler
    var newImg = $("<img>").attr("id", element.id).addClass("card-img-top GIF").attr("style", "max-height: 200px ;height :200px;width:310px ; min-width: 310px ").attr("src-still", element.srcStill).attr("src-play", element.srcPlay).attr("src", element.srcStill).attr("rating", element.rating).attr("title", element.title);
    var cardBody = $("<div>").addClass("card-body text-info").attr("style", "background: rgb(0,0,0);height :160px");
    var newlink = $("<a>").addClass("UNsave btn btn-outline-info").text("♥").attr("image-id", element.id);

    // grab gif Title and Rating from API
    var newH = $("<h5>").addClass("card-title").text("Saved : " + element.title);
    var newP = $("<p>").addClass("card-text").text("Rating : " + element.rating);
    cardBody.append(newlink, newH, newP);
    cardDiv.append(newImg, cardBody);
    // show new card on top
    $("#buttom").prepend(cardDiv);

  });
}
// /////////
// event handler
// /////////

$(document).on("click", ".topic", displayGifs);
$(document).on("click", ".GIF", function () {
  // get an instant of the image clicked on
  var newImg = $(this);

  // set image src to loading.gif
  newImg.attr("src", "assets\\images\\loading.gif").attr("class", "card-img-top ");

  // after time-out call playGif with image clicked on instant (to save id and image container id)
  setTimeout(function () { playGif(newImg) }, 500);
});
$(document).on("click", ".stopGIF", function () {
  // get an instant of the image clicked on
  var newImg = $(this);
  // set image src to loading gif
  newImg.attr("src", "assets\\images\\loading.gif").attr("class", "card-img-top ");

  // after time-out call stopGif with image clicked on instant (to save id and image container id)
  setTimeout(function () { stopGif(newImg) }, 500);
});
$(document).on("click", "#clear", function () {
  // clear the buttom container
  $("#buttom").empty();
  // set index of each member of topics to 0
  topics.filter(function (i) {
    i.index = 0;
  });
  // re render buttons
  renderButtons();
});
$(document).on("click", "#show-saved", showSaved);
$(document).on("click", "#add-cat", function () {
  // make sure input is not empty
  if ($("#input").val().trim()) {
    // This line of code will grab the topic from the textbox , remove empty space and make it lowercase
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
      // delete text in the text box (success)
      $("#input").val("")
      // Calling renderButtons which handles the processing of our topic array
      renderButtons();
    }
  }
});
$(document).on("click", ".UNsave", function () {
  $(this).text("♡").attr("class", "save btn btn-outline-info");
  //  console.log(localStorage);

  localStorage.removeItem($(this).attr("image-id"));

});
$(document).on("click", ".save", function () {
  $(this).text("♥").attr("class", "UNsave btn btn-outline-info");
  var obj = new Object;
  var image = $("#" + $(this).attr("image-id"));
  obj.srcStill = image.attr("src-still");
  obj.srcPlay = image.attr("src-play");
  obj.id = image.attr("id");
  obj.rating = image.attr("rating");
  obj.title = image.attr("title");
  localStorage.setItem(obj.id, JSON.stringify(obj));

  // console.log(obj)
});
// rendering initial 
$(document).ready(function () {
  renderButtons();
  showSaved();
});

