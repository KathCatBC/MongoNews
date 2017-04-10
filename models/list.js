// Require mongoose
var mongoose = require("mongoose");

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

// Make a Schema
var NewsSchema = new Schema({
  // name: a unique string
  name: {
    type: String,
    unique: true
  },
  // books is an array that stores ObjectIds
  // The ref property links these ObjectIds to the Book model
  // This will let us populate the library with these books, rather than the ids,
  // using Mongoose's populate method (See the routes in Server.js)
  articles: [{
    type: Schema.Types.ObjectId,
    ref: "Article"
  }]
});

// Save the News model using the LibrarySchema
var News = mongoose.model("News", LibrarySchema);

// Export the News model
module.exports = News;
