const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');

const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    password: String
});

userSchema.plugin(mongoosastic)

mongoose.model('User', userSchema);

module.exports = mongoose.model('User');