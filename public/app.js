// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#editBtn", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(`article id: ${thisId}` )

  let note = prompt("Enter your notes and click OK:", "Type your note here...");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: note
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
    });
});

// when you click the scraper button
$(document).on('click', '#scraperButton', function () {
  let count = 0;
  $.get('/scrape', function (result) {
    console.log('count ' + result)
    alert('Articles have been saved!')
  })
})

// when you click the Saved Articles button
$(document).on('click', '#savedArticles', function () {
  console.log('saved articles button is clicked...')
  
  getSavedArticles()
})

//when DELETE button is clicked
$(document).on('click', '#deleteBtn', function(){
  console.log('delete button is clicked...')
  var thisId = $(this).attr("data-id");
  console.log(`article id: ${thisId}`)
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  }).then($("tbody").empty(), getSavedArticles)
})

function getSavedArticles(){
  console.log('retrieving saved articles...')
  $.getJSON("/articles", function(data) {
    data.forEach(element => {
      let articleId = element._id;
      let title = element.title;
      let row = `<tr><td> ${title} </td>
      <td>
      <button type='button' class='btn btn-primary btn-sm' data-id= ${articleId} id='editBtn' data-toggle="modal" data-target="#editModal">Edit</button>
      <button class='btn btn-danger btn-sm' data-id= ${articleId} id='deleteBtn'>Delete</button>
      </td>
      </tr>`;

      $("tbody").append(row);
    });
  })
}

