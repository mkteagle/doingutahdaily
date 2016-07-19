var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title: String,
    content: String
});


//Export Model
module.exports = mongoose.model('Blog', blogSchema);

// var simpleSchedma = new Schema({ fieldName: SchemaType});