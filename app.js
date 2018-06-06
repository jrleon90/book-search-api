require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database/db');
const elasticsearch = require('elasticsearch');

const app = express();

//Load routes
const loginController = require('./controller/loginController');
const bookController = require('./controller/bookController');
const userController = require('./controller/userController');

//Assigning routes
app.use('/book', bookController);
app.use('/login', loginController);
app.use('/user', userController);

//Root route
app.use('/',(req,res)=>{
   res.json({'Message': 'Welcome to the book search API!'})
});



module.exports = app;