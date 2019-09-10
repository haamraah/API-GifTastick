var saveTopics = [
  {
    name: "Uma Thurman",
    index: 0
  }
  , {
    name: "pulp fiction",
    index: 0
  }
  , {
    name: "dominic decoco",
    index: 0
  }
  , {
    name: "Jules Winnfield",
    index: 0
  }
]
if (!alreadySaved("topics")) {
  localStorage.setItem("topics", JSON.stringify(saveTopics));
}

var topics = JSON.parse(localStorage.getItem("topics"))
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
    // Adds a class of .topic to our button
    a.addClass("topic btn btn-outline-info m-0 m-r-0 p-1");
    // Added a data-attribute
    a.attr("data-name", topics[i].name);
    //  added a startAt index
    a.attr("startAt", topics[i].index);
    // Provided the initial button text
    a.text(topics[i].name + " +" + topics[i].index);

    // create a close (X) button
    var removeBtn = $("<button>");
    removeBtn.addClass("removeBtn btn btn-outline-info border-0 p-0 m-0 mr-3");
    // Added a data-attribute
    removeBtn.attr("data-name", topics[i].name);
    removeBtn.attr("style", "font-size:20px; ");
    // Provided the initial button text
    removeBtn.text("⮽");
    // Added the X button to top div
    // Added the topic button to the top div
    $("#top").append(a, removeBtn);




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
      var cardDiv = $("<div>").addClass("card m-2 bg-dark").attr("id", "div-" + response.data[i].id);
      // id is dynamiclly generated for each image , save the still and playing url from api in to src-still and src-play attribute, assign GIF class for event handler    
      var newImg = $("<img>").attr("id", response.data[i].id).addClass("card-img img-GIF").attr("src-still", response.data[i].images.original_still.url).attr("src-play", response.data[i].images.original.url).attr("src", response.data[i].images.original_still.url).attr("rating", response.data[i].rating).attr("title", response.data[i].title).attr("style", "height:100%;");


      var cardBody = $("<div>").addClass("card-img-overlay GIF d-flex align-items-end justify-content-between text-white").attr("unic-id", response.data[i].id).attr("id", "div-" + response.data[i].id);

      // checking by id if image is already in saved items
      if (!alreadySaved(response.data[i].id)) {
        var newlink = $("<a>").addClass("save float-right btn btn-outline-info").text("♡").attr("image-id", response.data[i].id).attr("style", "text-shadow: 2px 2px 1px #000000");
      } else {
        var newlink = $("<a>").addClass("UNsave float-right btn btn-outline-info").text("♥").attr("image-id", response.data[i].id).attr("style", "text-shadow: 2px 2px 1px #000000");
      }
      // play button on still image
      var maskImg = $("<img>").attr("src", "assets/images/GIF.png").addClass("align-self-center");

      // grab gif Title and Rating from API
      var newH = $("<p>").addClass("card-text ").text(`${response.data[i].title.substring(0, 18)}... 
      Rate: ${response.data[i].rating}`).attr("style", "text-shadow: 2px 2px 1px #000000");
      // append title-rating , play button , save button
      cardBody.append(newH, maskImg, newlink);

      cardDiv.append(newImg, cardBody);
      // show new card on top

      $("#buttom").prepend(cardDiv);
    }

  });
}
function playGif(img) {
  // set image src to src-play attr , we saved playing and still image url before , also add stopGIF class for event handler
  img.attr("src", img.attr("src-play")).attr("class", "card-img-top img-stopGIF");
}
function stopGif(img) {
  // set image src to src-play attr , we saved playing and still image url before , also add stopGIF class for event handler
  img.attr("src", img.attr("src-still")).attr("class", "card-img-top img-GIF");
}

function alreadySaved(id) {
  // read localStorage and save it in obj, then we read each key in the obj object 
  var obj = localStorage;
  var foundIt = false;
  Object.keys(obj).forEach(function (key) {
    if (id === key) { foundIt = true }

  });
  return foundIt;
}
function showSaved() {
  // read localStorage and save it in obj, then we read each key in the obj object 
  var obj = localStorage;
  Object.keys(obj).forEach(function (key) {
    if (key != "topics") {
      // for each key we have a json , use parse for convert json to js object 
      var element = JSON.parse(localStorage.getItem(key))
      // 
      var cardDiv = $("<div>").addClass("card bg-dark  m-1 float-left").attr("id", "div-" + element.id);
      // id is dynamiclly generated for each image , save the still and playing url from api in to src-still and src-play attribute, assign GIF class for event handler
      var newImg = $("<img>").attr("id", element.id).addClass("card-img GIF").attr("src-still", element.srcStill).attr("src-play", element.srcPlay).attr("src", element.srcStill).attr("rating", element.rating).attr("title", element.title).attr("style", "height :100%;");

      var cardBody = $("<div>").addClass("card-img-overlay GIF d-flex align-items-end justify-content-between text-white").attr("unic-id", element.id);
      // save button
      var newlink = $("<a>").addClass("UNsave float-right btn btn-outline-info").text("♥").attr("image-id", element.id).attr("style", "text-shadow: 2px 2px 1px #000000");;
      // play button
      var maskImg = $("<img>").attr("src", "assets/images/GIF.png").addClass("align-self-center");

      // grab gif Title  from localStorage
      var newH = $("<p>").addClass("card-text").text(element.title).attr("style", "max-width:40%;text-shadow: 2px 2px 1px #000000");

      // append title-rating , play button , save button
      cardBody.append(newH, maskImg, newlink);
      cardDiv.append(newImg, cardBody);
      // show new card on top
      $("#buttom").prepend(cardDiv);
    }
  });


}
function checkSaved() {
  // // if we call checkSaved with parameter
  // if (id) {
  //   const obj = localStorage;
  //   Object.keys(obj).forEach(function (obj) {
  //     if (obj.id == id) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   });
  //   // if we call checkSaved without any parameter
  // } else if (!id) {  // check if localStorage is empty, if
  const obj = localStorage;
  if (Object.keys(obj).length == 1) {
    $("#show-saved").text("♡").attr("class", "btn  btn-outline-info float-right m-1")

  } else {
    $("#show-saved").text("♥").attr("class", "show-saved btn  btn-outline-info float-right m-1")

  }
  // }
}
function pushSaved() {

  var obj = {
    id: "U3E2gTwAyacx2",
    rating: "pg",
    srcPlay: "https://media3.giphy.com/media/U3E2gTwAyacx2/giphy.gif?cid=080e98f186f59a7d35e548f3352d212c22725c9ff27417fe&rid=giphy.gif",
    srcStill: "https://media3.giphy.com/media/U3E2gTwAyacx2/giphy_s.gif?cid=080e98f186f59a7d35e548f3352d212c22725c9ff27417fe&rid=giphy_s.gif",
    title: "roman GIF",
  }
  // check if we already have roman GIF ^ in localStorage 
  if (!alreadySaved(obj.id)) {
    localStorage.setItem(obj.id, JSON.stringify(obj));
  }


}

// /////////
// event handler
// /////////

$(document).on("click", ".topic", displayGifs);
$(document).on("click", ".GIF", function () {
  // get an instant of the image clicked on , unic-id is paired with image id and "div-"+[id]
  var newImg = $("#" + $(this).attr("unic-id"));
  playGif(newImg);
  // remove title , play and save button
  $(this).attr("class", "card-img-overlay stopGIF d-flex align-items-end justify-content-between text-white");
  $(this).empty()

});
$(document).on("click", ".stopGIF", function () {

  // get an instant of the image clicked on
  var newImg = $("#" + $(this).attr("unic-id"));
  // changee back the class of div clicked on to GIF
  $(this).attr("class", "card-img-overlay GIF d-flex align-items-end justify-content-between text-white");
  // and create and append title-play and save button again wehen we stop playing
  // save button
  if (!alreadySaved(newImg.attr("id"))) {
    var newlink = $("<a>").addClass("save float-right btn btn-outline-info").text("♡").attr("image-id", newImg.attr("id")).attr("style", "text-shadow: 2px 2px 1px #000000");
  } else {
    var newlink = $("<a>").addClass("UNsave float-right btn btn-outline-info").text("♥").attr("image-id", newImg.attr("id")).attr("style", "text-shadow: 2px 2px 1px #000000");
  }
  // play button
  var maskImg = $("<img>").attr("src", "assets/images/GIF.png").addClass("align-self-center");

  // grab gif Title and Rating from img
  var newH = $("<p>").addClass("card-text ").text(newImg.attr("title") + "... " + " Rate: " + newImg.attr("rating")).attr("style", "text-shadow: 2px 2px 1px #000000");

  $(this).append(newH, maskImg, newlink);
  // stop playing
  stopGif(newImg);

})
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
$(document).on("click", ".show-saved", showSaved);
$(document).on("click", "#add-cat", function () {
  // make sure input is not empty
  if ($("#input").val().trim()) {
    // This line of code will grab the topic from the textbox , remove empty space and make it lowercase
    var newTopic = $("#input").val().trim().toLowerCase();
    // make sure we do not duplicate a topic
    var notInTopics = true;
    topics.forEach(i => {
      if (i.name == newTopic) {
        notInTopics = false;
      }
    })
    if (notInTopics) {
      // The topic from the textbox is then added to our array
      var newObj = { name: newTopic, index: 0 }
      topics.push(newObj);

      localStorage.setItem("topics", JSON.stringify(topics));

      // delete text in the text box (success)
      $("#input").val("")
      // Calling renderButtons which handles the processing of our topic array
      renderButtons();
    }
  }
});
$(document).on("click", ".UNsave", function () {
  $(this).text("♡").attr("class", "save btn btn-outline-info");
  localStorage.removeItem($(this).attr("image-id"));
  checkSaved();
});
$(document).on("click", ".save", function () {
  $(this).text("♥").attr("class", "UNsave btn btn-outline-info");
  // add new saved image in localStorage
  var obj = new Object;
  var image = $("#" + $(this).attr("image-id"));
  obj.srcStill = image.attr("src-still");
  obj.srcPlay = image.attr("src-play");
  obj.id = image.attr("id");
  obj.rating = image.attr("rating");
  obj.title = image.attr("title");
  localStorage.setItem(obj.id, JSON.stringify(obj));

  checkSaved();
});
$(document).on("click", ".removeBtn", function () {
  var buttonTopic = $(this).attr("data-name");
  topics = topics.filter(function (topic) {
    if (topic.name !== buttonTopic) { return topic }
  })
  localStorage.setItem("topics", JSON.stringify(topics));
  renderButtons();
});
// rendering initial 
$(document).ready(function () {

  renderButtons();
  pushSaved();
  showSaved();

  checkSaved();
  // alreadySaved("a");
});

