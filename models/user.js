const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const jwt = require('jsonwebtoken');

//User schema for MongoDB
const userSchema = new mongoose.Schema({
    _id: String,
    username: {type: String, unique: true},
    password: String
});

mongoose.model('User', userSchema);




module.exports = mongoose.model('User');