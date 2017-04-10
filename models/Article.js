// Require mongoose
var mongoose = require("mongoose");

// Create a Schema class with mongoose
var Schema = mongoose.Schema;

// make a Schema
var ArticleSchema = new Schema({
  title: {
    type: String
  },
  link: {
    type: String
  },
  note: {
  	type: Schema.Types.ObjectId,
  	ref: "Note"
  }
});

// NOTE: the book's id is stored automatically
// Our Library model will have an array to store these ids

// Create the Book model with the BookSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model so we can use it on our server file.
module.exports = Article;
