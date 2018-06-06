const mongoose = require('mongoose');

//Book schema for MongoDB
const bookSchema = new mongoose.Schema({
    _id: String,
    name: {type: String, es_indexed: true, unique:true},
    tags: {type: [String], es_indexed: true}
});

mongoose.model('Book', bookSchema);

module.exports = mongoose.model('Book');