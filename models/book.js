const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

const bookSchema = new mongoose.Schema({
    _id: String,
    name: {type: String, es_indexed: true},
    tags: {type: [String], es_indexed: true}
});

bookSchema.plugin(mongoosastic,{
    hosts:['https://paas:02c1862d80bb264a93750c2c1ace49a7@thorin-us-east-1.searchly.com']
});

mongoose.model('Book', bookSchema);

module.exports = mongoose.model('Book');