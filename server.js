/* Showing Mongoose's "Populated" Method (18.3.8)
 * INSTRUCTOR ONLY
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

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
      console.log(result.link);

        // Perform a simple find and return all the documents
      Article.findOne({link:result.link}, {returnkey: true}, function(err, doc) {

        if (doc == null) {
          console.log("no match " + doc)
          entry.save(function(errSave, docSave) {
            if (err) {
              // console.log(errSave);
              res.json(docSave)
            } else {
              res.json(docSave)  // works no error
              // console.log(docSave);
            } 
          });
        } else {
          res.json("doc " + doc + " = match");  // works no error
          // console.log("doc " + doc + " = match"); 
        }
      });
  
        });
    });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");

});


// This will get the articles we scraped from the mongoDB
app.get("/", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, data) {
    // Log any errors
    if (error) {
      res.json(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.render("index", { articles: data})
    }
  });
});

// Grab an article by it's ObjectId
// app.get("/article/:id", function(req, res) {
//   console.log(req.params)
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   Article.findOne({ "_id": req.params.id })
//   // ..and populate all of the notes associated with it
//   .populate("note")
//   // now, execute our query
//   .exec(function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     else {
//       res.json(doc);
//     }
//   });
// });


app.get("/note/:articleid", function(req, res) {
  console.log("params" + req.params)
  Note.find({ "articlelink" : req.params.articleid}, function(error, data) {
    if (error) {
      res.render("error: " + error);
    } 
    else {
      console.log("data: " + data)
      res.render("index", {notes: data})
    }
  });
});

app.delete("/article/:id", function(req, res) {
  console.log("app.delete   ID:  " + req.params.id)

  Article.findByIdAndRemove(req.params.id, function(err, done) {
      if(err) {
        res.json(err)
        console.log('there was an error in delete')
      } else {
        res.json('done = '+ done);
      }
    });
  });


// app.get("/articles", function(req, res) {
//   // Grab every doc in the Articles array
//   Article.find({}, function(error, data) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     // Or send the doc to the browser as a json object
//     else {
//             res.render("index", {notes: data})
//       // res.json(data);
//     }
//   });
// });


// app.post("/note/:par/:title/:body", function(req, res){




// //   db.inventory.insertOne(
// //    { item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } }
// // )
//     Note.insertOne({'title': req.params.title, 'body': req.params.body, 'articlelink': req.params.par}, {forceServerObjectId, true}, function(errSave, docSave){

//     }) 
     
     
//         if (errSave) {
//           console.log(errSave);
//         } else {
//           console.log(docSave);
//               // clear entry and show all comments
//         } 
     
//     });


 



// Create a new note or replace an existing note
// app.post("/article/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   var newNote = new Note(req.body);

//   // And save the new note the db
//   newNote.save(function(error, doc) {
//     // Log any errors
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise
//     else {
//       // Use the article id to find and update it's note
//       Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
//       // Execute the above query
//       .exec(function(err, doc) {
//         // Log any errors
//         if (err) {
//           console.log(err);
//         }
//         else {
//           // Or send the document to the browser
//           res.send(doc);
//         }
//       });
//     }
//   });
// });


// Listen on port 3000
app.listen(3005, function() {
  console.log("App running on port 3005!");
});
