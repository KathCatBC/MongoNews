/* Showing Mongoose's "Populated" Method (18.3.8)
 * INSTRUCTOR ONLY
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/mongonews");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});




app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.nj.com/", function(error, response, html) {
    var $ = cheerio.load(html);
    $(".fullheadline").each(function(i, element) {
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children().text();
      result.link = $(this).children().attr("href");
      var entry = new Article(result);
        // get result.link 
        // if result.link is not found then write to db
      if (true) { // this will be replace with the real logic 
          entry.save(function(err, doc) {
        // Log any errors
            if (err) {
              console.log(err);
            } else {
              console.log(doc);
            } 
          });
        }
    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");

  //   Article.find({}, function(error, data) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     res.render("index", { articles: data})
  //   }
  // });


});



// original


// This will get the articles we scraped from the mongoDB
app.get("/", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, data) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.render("index", { articles: data})
    }
  });
});

// Grab an article by it's ObjectId
app.get("/article/:id", function(req, res) {
  console.log(req.params)
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});


app.delete("/article/:id", function(req, res) {
  console.log("app.delete   ID:  " + req.params.id)

  Article.findByIdAndRemove(req.params.id, function(err, done) {
      if(err) {
        console.log(err)
      } else {
        console.log(done)
      }
  });
  
});


// app.delete("/article/:id", function(req, res) {
//   console.log("app.delete   ID:  " + req.params.id)
//   Article.deleteOne( { "_id": req.params.id } )
 
//   .exec(function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("deleted? " + doc)
//     }
//   });
// });

// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});


// Listen on port 3000
app.listen(3005, function() {
  console.log("App running on port 3005!");
});
