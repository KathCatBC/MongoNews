
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");


mongoose.Promise = Promise;

var app = express();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Make public a static dir
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration with mongoose

var PORT = process.env.PORT || 3001;


//local
mongoose.connect(MONGODB_URI);



//server
// process.env.MONGODB_URI = 'mongodb://heroku_zxc81h22:33c4ht2ilg9gcm1b3c8h4rpt9tc@ds161640.mlab.com:61640/heroku_zxc81h22';

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongonews";


mongoose.connect(MONGODB_URI);

var db = mongoose.connection;



// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});



//***********************************
// This will not reload the page, but does not cause an unhandled Error
// Can't set headers after they are sent

app.get("/scrape", function(req, res) {

  // var headlines = [];
  var artCounter = 0;
  request("http://www.nj.com/", function(error, response, html) {
    var $ = cheerio.load(html);
    
    $(".fullheadline").each(function(i, element) {
      var result = {};

      result.title = $(this).children().text();
      result.link = $(this).children().attr("href");
      var entry = new Article(result);
      console.log(result.link);
      // headlines.push(result);

      Article.findOne({ link: result.link }, { returnkey: true }, function(
        err,
        doc
      ) {
        if (doc == null) {
          console.log("no match " + doc);
          entry.save(function(errSave, docSave) {
            if (err) {
              console.log(errSave);

            } else {
              console.log(docSave);
              artCounter ++
            }
          });
        } else {
          console.log("doc " + doc + " = match");
        }
      });
    });


  });
  // Tell the browser that we finished scraping the text
   return res.json(artCounter);



});


// This will get the articles we scraped from the mongoDB
app.get("/", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, data) {
    // Log any errors
    if (error) {
      res.json(error);
    } else {
      // Or send the doc to the browser as a json object
      res.render("index", { articles: data });
    }
  });
});


app.get("/note/:articleid", function(req, res) {
  console.log("params" + req.params.articleid);

  Note.find({ article: req.params.articleid }, function(error, data) {
    if (error) {
      res.json("error: " + error);
    } else {

    res.json(data)
    }
  });
});


app.delete("/article/:id", function(req, res) {
  console.log("app.delete   ID:  " + req.params.id);

  Article.findByIdAndRemove(req.params.id, function(err, done) {
    if (err) {
      res.json(err);
      console.log("there was an error in delete");
    } else {
      res.json("done = " + done);
    }
  });
});


app.post("/note/:par/:title/:body", function(req, res) {
  console.log("post new note");
  console.log()

  var newNote = {};

  newNote.title = req.params.title;
  newNote.body = req.params.body;
  newNote.article = req.params.par;

  var entry = new Note(newNote);

  entry.save(function(errSave, docSave) {
    if (errSave) {
      res.json(errSave);
    } else {
      res.json(docSave);
    }
  });
});



// Listen on port 3000
app.listen(3005, function() {
  console.log("App running on port 3005!");
});
